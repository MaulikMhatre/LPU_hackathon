export async function mockSignIn(email, password, loginType) {
  const delay = Math.random() * 1000 + 500;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Define successful credentials
  const MOCK_USER = {
    email: "test@smartlearn.com",
    password: "password123",
  };
  
  // Check for valid credentials
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    // path: Return simulated user data
    return {
      userId: `user-${Math.floor(Math.random() * 10000)}`,
      username: "Smart Learner",
      role: loginType, 
      message: `Successfully signed in as a ${loginType}.`,
    };
  } else {
    // Failure path: Throw an error
    let errorMessage = "Invalid email or password. Please try the mock credentials: test@smartlearn.edu / password123";
    
    if (!email || !password) {
        errorMessage = "Please enter both email and password.";
    }

    throw new Error(errorMessage);
  }
}
