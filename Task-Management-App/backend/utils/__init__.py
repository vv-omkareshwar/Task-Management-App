// index.ts

// Import all functions from auth_utils.ts
import * as authUtils from './auth_utils';

// Re-export all functions from auth_utils
export { authUtils };

// If there are any other utility files in the future, we can import and export them here as well
// For example:
// import * as otherUtils from './other_utils';
// export { otherUtils };

// If there's any initialization logic that needs to run when the utils package is imported,
// we can add it here. For now, we'll leave it empty as we don't have any information about
// initialization requirements.

// We could also consider exporting specific functions directly if they're commonly used:
// export const { generateToken, verifyToken, hashPassword, checkPassword } = authUtils;

// This approach allows consumers to import either the entire authUtils object:
// import { authUtils } from './utils';
// Or specific functions:
// import { generateToken, verifyToken } from './utils';