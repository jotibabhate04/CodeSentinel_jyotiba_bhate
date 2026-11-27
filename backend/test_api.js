const BASE_URL = process.env.BASE_URL || 'http://localhost/api';

async function request(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(fullUrl, config);
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  return {
    status: response.status,
    ok: response.ok,
    data
  };
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 Starting CodeSentinel Full E2E Integration Tests');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, description) => {
    if (condition) {
      console.log(`  ✅ PASS: ${description}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${description}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.status === 200 && health.data?.status === 'UP', 'Health check endpoint returns UP');

    const testEmail1 = `operator_${Date.now()}@sentinel.io`;
    const testPassword = 'Password123!';

    // 2. Register User 1
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Sentinel Commander',
        email: testEmail1,
        password: testPassword
      }
    });
    assert(regRes.status === 201 && regRes.data?.success && regRes.data?.token, 'User 1 registered with JWT token');
    const token1 = regRes.data?.token;

    // 3. Register Duplicate Email (should fail 409)
    const dupRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Imposter',
        email: testEmail1,
        password: testPassword
      }
    });
    assert(dupRes.status === 409, 'Duplicate registration was rejected with 409');

    // 4. Login with correct credentials
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testEmail1,
        password: testPassword
      }
    });
    assert(loginRes.status === 200 && loginRes.data?.token, 'User 1 login successful with valid token');

    // 5. Login with wrong password (should fail 401)
    const badLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testEmail1,
        password: 'WrongPassword999'
      }
    });
    assert(badLoginRes.status === 401, 'Login with wrong password rejected with 401');

    // 6. Access Profile with JWT
    const profileRes = await request('/auth/profile', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(profileRes.status === 200 && profileRes.data?.user?.email === testEmail1, 'Protected profile fetched successfully');

    // 7. Access Profile without JWT (should fail 401)
    const unauthProfileRes = await request('/auth/profile');
    assert(unauthProfileRes.status === 401, 'Unauthenticated profile request rejected with 401');

    // 8. Create Task 1 (High priority)
    const task1Res = await request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token1}` },
      body: {
        title: 'Configure Terraform ECS Cluster',
        description: 'Set up modular infrastructure as code for CodeSentinel three-tier app',
        priority: 'High',
        status: 'pending',
        dueDate: '2026-12-01'
      }
    });
    assert(task1Res.status === 201 && task1Res.data?.data?.title === 'Configure Terraform ECS Cluster', 'Created Task 1 (High Priority)');
    const taskId1 = task1Res.data?.data?.id;

    // 9. Create Task 2 (Medium priority)
    const task2Res = await request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token1}` },
      body: {
        title: 'Setup SonarQube Quality Gate',
        description: 'Automate code quality and vulnerability scans in Jenkins pipeline',
        priority: 'Medium',
        status: 'pending'
      }
    });
    assert(task2Res.status === 201, 'Created Task 2 (Medium Priority)');
    const taskId2 = task2Res.data?.data?.id;

    // 10. Create Task 3 (Low priority)
    const task3Res = await request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token1}` },
      body: {
        title: 'Review Documentation & Runbooks',
        description: 'Ensure deployment guides and architecture diagrams are up to date',
        priority: 'Low',
        status: 'pending'
      }
    });
    assert(task3Res.status === 201, 'Created Task 3 (Low Priority)');

    // 11. Get all tasks for User 1
    const allTasksRes = await request('/tasks', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(allTasksRes.status === 200 && allTasksRes.data?.count === 3, 'Fetched all tasks (count = 3)');

    // 12. Get single task by ID
    const singleTaskRes = await request(`/tasks/${taskId1}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(singleTaskRes.status === 200 && singleTaskRes.data?.data?.id === taskId1, 'Fetched single task by ID');

    // 13. Update task
    const updateRes = await request(`/tasks/${taskId1}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token1}` },
      body: {
        title: 'Configure Terraform ECS Cluster & ALB',
        description: 'Updated with Application Load Balancer and autoscaling rules',
        priority: 'High',
        status: 'pending',
        dueDate: '2026-12-05'
      }
    });
    assert(updateRes.status === 200 && updateRes.data?.data?.title?.includes('& ALB'), 'Updated task details via PUT');

    // 14. Mark task as completed (PATCH /status)
    const patchRes = await request(`/tasks/${taskId1}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token1}` },
      body: { status: 'completed' }
    });
    assert(patchRes.status === 200 && patchRes.data?.data?.status === 'completed', 'Marked task as completed via PATCH');

    // 15. Check stats endpoint
    const statsRes = await request('/tasks/stats', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(
      statsRes.status === 200 &&
      statsRes.data?.data?.total === 3 &&
      statsRes.data?.data?.completed === 1 &&
      statsRes.data?.data?.pending === 2,
      `Stats calculated correctly (Total: ${statsRes.data?.data?.total}, Completed: ${statsRes.data?.data?.completed}, Pending: ${statsRes.data?.data?.pending})`
    );

    // 16. Search tasks by title
    const searchRes = await request('/tasks?search=SonarQube', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(searchRes.status === 200 && searchRes.data?.count === 1 && searchRes.data?.data[0]?.id === taskId2, 'Search filtered accurately by keyword');

    // 17. Filter by status
    const filterStatusRes = await request('/tasks?status=completed', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(filterStatusRes.status === 200 && filterStatusRes.data?.count === 1, 'Filter by status=completed returned 1 task');

    // 18. User Isolation & Tenancy Verification
    const testEmail2 = `tenant2_${Date.now()}@sentinel.io`;
    const reg2Res = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Tenant User Two',
        email: testEmail2,
        password: testPassword
      }
    });
    const token2 = reg2Res.data?.token;

    // User 2 tasks should be 0
    const tenant2Tasks = await request('/tasks', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token2}` }
    });
    assert(tenant2Tasks.status === 200 && tenant2Tasks.data?.count === 0, "User 2 cannot see User 1's tasks (Isolated Tenancy)");

    // User 2 tries to GET User 1's task
    const tenant2GetTask1 = await request(`/tasks/${taskId1}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token2}` }
    });
    assert(tenant2GetTask1.status === 404, "User 2 blocked from viewing User 1's task (404/Forbidden)");

    // User 2 tries to UPDATE User 1's task
    const tenant2UpdateTask1 = await request(`/tasks/${taskId1}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token2}` },
      body: { title: 'Hacked task title', priority: 'Low', status: 'pending' }
    });
    assert(tenant2UpdateTask1.status === 404, "User 2 blocked from modifying User 1's task (404/Forbidden)");

    // User 2 tries to DELETE User 1's task
    const tenant2DeleteTask1 = await request(`/tasks/${taskId1}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token2}` }
    });
    assert(tenant2DeleteTask1.status === 404, "User 2 blocked from deleting User 1's task (404/Forbidden)");

    // 19. Delete Task 1 by User 1
    const deleteRes = await request(`/tasks/${taskId1}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(deleteRes.status === 200 && deleteRes.data?.success, 'User 1 successfully deleted their own task');

    // 20. Confirm task is gone
    const confirmGoneRes = await request(`/tasks/${taskId1}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token1}` }
    });
    assert(confirmGoneRes.status === 404, 'Deleted task is no longer accessible (404 Not Found)');

  } catch (error) {
    console.error('Unexpected test execution failure:', error);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`📊 Test Summary: ${passed} Passed | ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
