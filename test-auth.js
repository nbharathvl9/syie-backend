const API_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    fullName: 'Auth Test User',
    rollNumber: 'am.sc.u4cse99999', // Ensure this ID is unique/new
    password: 'password123'
};

async function testAuth() {
    console.log('--- START AUTH TEST ---');

    try {
        // 1. Register
        console.log('\n1. Testing Registration...');
        let regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        let regData = await regRes.json();

        if (regRes.ok) {
            console.log('✅ Registration Success:', regData);
        } else {
            if (regData.msg === 'User already exists') {
                console.log('⚠️ User already exists, proceeding to login...');
            } else {
                console.error('❌ Registration Failed:', regData);
                return;
            }
        }

        // 2. Login
        console.log('\n2. Testing Login...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rollNumber: TEST_USER.rollNumber,
                password: TEST_USER.password
            })
        });
        const loginData = await loginRes.json();

        if (loginRes.ok) {
            console.log('✅ Login Success:', loginData);
        } else {
            console.error('❌ Login Failed:', loginData);
        }

        // 3. Login with Wrong Password
        console.log('\n3. Testing Login (Wrong Password)...');
        const wrongPassRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rollNumber: TEST_USER.rollNumber,
                password: 'wrongpassword'
            })
        });
        const wrongPassData = await wrongPassRes.json();

        if (!wrongPassRes.ok && wrongPassRes.status === 400) {
            console.log('✅ Login (Wrong Password) Correctly Rejected:', wrongPassData);
        } else {
            console.error('❌ Login (Wrong Password) Failed unexpectedly:', wrongPassData);
        }

    } catch (err) {
        console.error('❌ GLOBAL TEST ERROR:', err.message);
    }
    console.log('\n--- END AUTH TEST ---');
}

testAuth();
