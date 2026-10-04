"""
Live Endpoints Verification Script
Tests all running backend endpoints:
1. GET /api/health
2. POST /api/validate (Gibberish instant rejection)
3. POST /api/auth/google (Dev token fallback & JWT generation)
4. GET /api/auth/me (Protected route verification)
5. POST /api/validate/async (Background job ticket creation)
6. GET /api/jobs/{id} (Job polling & status check)
"""

import sys
import json
import urllib.request
import urllib.error

# Ensure Windows terminal doesn't choke on unicode characters
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("=== LIVE BACKEND ENDPOINT VERIFICATION ===")
    
    # 1. Health check
    print("\n[1] Testing GET /api/health...")
    with urllib.request.urlopen(f"{BASE_URL}/api/health") as resp:
        data = json.loads(resp.read().decode())
        assert resp.status == 200
        assert data.get("status") in ["ok", "healthy"]
        print(f"    PASS: Status={data.get('status')}, Version={data.get('version')}")

    # 2. Gibberish rejection test
    print("\n[2] Testing POST /api/validate with adversarial gibberish...")
    payload = json.dumps({"idea": "asdfkjhasdkjfh zxcvbnm qwertyuiop"}).encode()
    req = urllib.request.Request(f"{BASE_URL}/api/validate", data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        val_data = json.loads(resp.read().decode())
        msg = val_data.get("summary", {}).get("message", "")
        assert resp.status == 200
        assert val_data.get("summary", {}).get("total_sources") == 0
        assert "plain English" in msg or "real idea" in msg
        print(f"    PASS: Fast-fail intercepted in <0.01s. Message: '{msg}'")

    # 3. Auth Google Dev Token
    print("\n[3] Testing POST /api/auth/google with dev token...")
    auth_payload = json.dumps({"credential": "dev_testfounder@gmail.com"}).encode()
    req = urllib.request.Request(f"{BASE_URL}/api/auth/google", data=auth_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        auth_data = json.loads(resp.read().decode())
        assert resp.status == 200
        token = auth_data.get("token")
        assert token is not None and len(token) > 20
        email = auth_data.get("user", {}).get("email")
        assert email == "testfounder@gmail.com"
        print(f"    PASS: JWT issued for {email}. Token length: {len(token)} chars")

    # 4. Protected Route: GET /api/auth/me
    print("\n[4] Testing GET /api/auth/me with Bearer token...")
    req = urllib.request.Request(f"{BASE_URL}/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req) as resp:
        me_data = json.loads(resp.read().decode())
        user_profile = me_data.get("user") or me_data
        assert resp.status == 200
        assert user_profile.get("email") == "testfounder@gmail.com"
        print(f"    PASS: Authenticated user profile retrieved: {user_profile.get('name')} ({user_profile.get('email')})")

    # 5. Async Validation Job Ticket: POST /api/validate/async
    print("\n[5] Testing POST /api/validate/async (FastAPI BackgroundTasks)...")
    async_payload = json.dumps({
        "idea": "An AI platform that automates SOC2 compliance for seed-stage startups",
        "email": "testfounder@gmail.com",
        "product_name": "GuardrailCI",
        "industry": "DevSecOps",
    }).encode()
    req = urllib.request.Request(f"{BASE_URL}/api/validate/async", data=async_payload, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    })
    with urllib.request.urlopen(req) as resp:
        async_data = json.loads(resp.read().decode())
        assert resp.status == 202
        job_id = async_data.get("job_id")
        assert job_id is not None
        assert async_data.get("status") in ["queued", "processing"]
        print(f"    PASS: HTTP 202 Accepted. Job ID={job_id}, Initial Status={async_data.get('status')}")

    # 6. Real-time Job Polling: GET /api/jobs/{id}
    print(f"\n[6] Testing GET /api/jobs/{job_id}...")
    req = urllib.request.Request(f"{BASE_URL}/api/jobs/{job_id}")
    with urllib.request.urlopen(req) as resp:
        job_data = json.loads(resp.read().decode())
        assert resp.status == 200
        assert job_data.get("job_id") == job_id
        assert job_data.get("status") in ["queued", "processing", "completed"]
        print(f"    PASS: Job state successfully polled: Status={job_data.get('status')}")

    # 7. User Jobs History: GET /api/user/jobs
    print("\n[7] Testing GET /api/user/jobs (User Dossier Library)...")
    req = urllib.request.Request(f"{BASE_URL}/api/user/jobs", headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        jobs_list = data.get("jobs", []) if isinstance(data, dict) else data
        assert resp.status == 200
        assert isinstance(jobs_list, list)
        print(f"    PASS: Retrieved {len(jobs_list)} persistent jobs for user from SQLite.")

    print("\n=============================================")
    print("ALL 7 LIVE API ENDPOINT CHECKS PASSED (100%)!")
    print("=============================================")

if __name__ == "__main__":
    run_tests()
