// AWS SDK for JavaScript v2.6.4
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// License at https://sdk.amazonaws.com/js/BUNDLE_LICENSE.txt
/* eslint-disable */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "version": "2.0",
  "metadata": {
    "apiVersion": "2014-06-30",
    "endpointPrefix": "cognito-identity",
    "jsonVersion": "1.1",
    "protocol": "json",
    "serviceFullName": "Amazon Cognito Identity",
    "signatureVersion": "v4",
    "targetPrefix": "AWSCognitoIdentityService"
  },
  "operations": {
    "CreateIdentityPool": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityPoolName",
          "AllowUnauthenticatedIdentities"
        ],
        "members": {
          "IdentityPoolName": {},
          "AllowUnauthenticatedIdentities": {
            "type": "boolean"
          },
          "SupportedLoginProviders": {
            "shape": "S4"
          },
          "DeveloperProviderName": {},
          "OpenIdConnectProviderARNs": {
            "shape": "S8"
          },
          "CognitoIdentityProviders": {
            "shape": "Sa"
          },
          "SamlProviderARNs": {
            "shape": "Se"
          }
        }
      },
      "output": {
        "shape": "Sf"
      }
    },
    "DeleteIdentities": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityIdsToDelete"
        ],
        "members": {
          "IdentityIdsToDelete": {
            "type": "list",
            "member": {}
          }
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "UnprocessedIdentityIds": {
            "type": "list",
            "member": {
              "type": "structure",
              "members": {
                "IdentityId": {},
                "ErrorCode": {}
              }
            }
          }
        }
      }
    },
    "DeleteIdentityPool": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityPoolId"
        ],
        "members": {
          "IdentityPoolId": {}
        }
      }
    },
    "DescribeIdentity": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityId"
        ],
        "members": {
          "IdentityId": {}
        }
      },
      "output": {
        "shape": "Sq"
      }
    },
    "DescribeIdentityPool": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityPoolId"
        ],
        "members": {
          "IdentityPoolId": {}
        }
      },
      "output": {
        "shape": "Sf"
      }
    },
    "GetCredentialsForIdentity": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityId"
        ],
        "members": {
          "IdentityId": {},
          "Logins": {
            "shape": "Sv"
          },
          "CustomRoleArn": {}
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "IdentityId": {},
          "Credentials": {
            "type": "structure",
            "members": {
              "AccessKeyId": {},
              "SecretKey": {},
              "SessionToken": {},
              "Expiration": {
                "type": "timestamp"
              }
            }
          }
        }
      }
    },
    "GetId": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityPoolId"
        ],
        "members": {
          "AccountId": {},
          "IdentityPoolId": {},
          "Logins": {
            "shape": "Sv"
          }
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "IdentityId": {}
        }
      }
    },
    "GetIdentityPoolRoles": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityPoolId"
        ],
        "members": {
          "IdentityPoolId": {}
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "IdentityPoolId": {},
          "Roles": {
            "shape": "S17"
          }
        }
      }
    },
    "GetOpenIdToken": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityId"
        ],
        "members": {
          "IdentityId": {},
          "Logins": {
            "shape": "Sv"
          }
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "IdentityId": {},
          "Token": {}
        }
      }
    },
    "GetOpenIdTokenForDeveloperIdentity": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityPoolId",
          "Logins"
        ],
        "members": {
          "IdentityPoolId": {},
          "IdentityId": {},
          "Logins": {
            "shape": "Sv"
          },
          "TokenDuration": {
            "type": "long"
          }
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "IdentityId": {},
          "Token": {}
        }
      }
    },
    "ListIdentities": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityPoolId",
          "MaxResults"
        ],
        "members": {
          "IdentityPoolId": {},
          "MaxResults": {
            "type": "integer"
          },
          "NextToken": {},
          "HideDisabled": {
            "type": "boolean"
          }
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "IdentityPoolId": {},
          "Identities": {
            "type": "list",
            "member": {
              "shape": "Sq"
            }
          },
          "NextToken": {}
        }
      }
    },
    "ListIdentityPools": {
      "input": {
        "type": "structure",
        "required": [
          "MaxResults"
        ],
        "members": {
          "MaxResults": {
            "type": "integer"
          },
          "NextToken": {}
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "IdentityPools": {
            "type": "list",
            "member": {
              "type": "structure",
              "members": {
                "IdentityPoolId": {},
                "IdentityPoolName": {}
              }
            }
          },
          "NextToken": {}
        }
      }
    },
    "LookupDeveloperIdentity": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityPoolId"
        ],
        "members": {
          "IdentityPoolId": {},
          "IdentityId": {},
          "DeveloperUserIdentifier": {},
          "MaxResults": {
            "type": "integer"
          },
          "NextToken": {}
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "IdentityId": {},
          "DeveloperUserIdentifierList": {
            "type": "list",
            "member": {}
          },
          "NextToken": {}
        }
      }
    },
    "MergeDeveloperIdentities": {
      "input": {
        "type": "structure",
        "required": [
          "SourceUserIdentifier",
          "DestinationUserIdentifier",
          "DeveloperProviderName",
          "IdentityPoolId"
        ],
        "members": {
          "SourceUserIdentifier": {},
          "DestinationUserIdentifier": {},
          "DeveloperProviderName": {},
          "IdentityPoolId": {}
        }
      },
      "output": {
        "type": "structure",
        "members": {
          "IdentityId": {}
        }
      }
    },
    "SetIdentityPoolRoles": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityPoolId",
          "Roles"
        ],
        "members": {
          "IdentityPoolId": {},
          "Roles": {
            "shape": "S17"
          }
        }
      }
    },
    "UnlinkDeveloperIdentity": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityId",
          "IdentityPoolId",
          "DeveloperProviderName",
          "DeveloperUserIdentifier"
        ],
        "members": {
          "IdentityId": {},
          "IdentityPoolId": {},
          "DeveloperProviderName": {},
          "DeveloperUserIdentifier": {}
        }
      }
    },
    "UnlinkIdentity": {
      "input": {
        "type": "structure",
        "required": [
          "IdentityId",
          "Logins",
          "LoginsToRemove"
        ],
        "members": {
          "IdentityId": {},
          "Logins": {
            "shape": "Sv"
          },
          "LoginsToRemove": {
            "shape": "Sr"
          }
        }
      }
    },
    "UpdateIdentityPool": {
      "input": {
        "shape": "Sf"
      },
      "output": {
        "shape": "Sf"
      }
    }
  },
  "shapes": {
    "S4": {
      "type": "map",
      "key": {},
      "value": {}
    },
    "S8": {
      "type": "list",
      "member": {}
    },
    "Sa": {
      "type": "list",
      "member": {
        "type": "structure",
        "members": {
          "ProviderName": {},
          "ClientId": {}
        }
      }
    },
    "Se": {
      "type": "list",
      "member": {}
    },
    "Sf": {
      "type": "structure",
      "required": [
        "IdentityPoolId",
        "IdentityPoolName",
        "AllowUnauthenticatedIdentities"
      ],
      "members": {
        "IdentityPoolId": {},
        "IdentityPoolName": {},
        "AllowUnauthenticatedIdentities": {
          "type": "boolean"
        },
        "SupportedLoginProviders": {
          "shape": "S4"
        },
        "DeveloperProviderName": {},
        "OpenIdConnectProviderARNs": {
          "shape": "S8"
        },
        "CognitoIdentityProviders": {
          "shape": "Sa"
        },
        "SamlProviderARNs": {
          "shape": "Se"
        }
      }
    },
    "Sq": {
      "type": "structure",
      "members": {
        "IdentityId": {},
        "Logins": {
          "shape": "Sr"
        },
        "CreationDate": {
          "type": "timestamp"
        },
        "LastModifiedDate": {
          "type": "timestamp"
        }
      }
    },
    "Sr": {
      "type": "list",
      "member": {}
    },
    "Sv": {
      "type": "map",
      "key": {},
      "value": {}
    },
    "S17": {
      "type": "map",
      "key": {},
      "value": {}
    }
  }
}
},{}],2:[function(require,module,exports){
module.exports={
  "version":"2.0",
  "metadata":{
    "apiVersion":"2016-04-18",
    "endpointPrefix":"cognito-idp",
    "jsonVersion":"1.1",
    "protocol":"json",
    "serviceFullName":"Amazon Cognito Identity Provider",
    "signatureVersion":"v4",
    "targetPrefix":"AWSCognitoIdentityProviderService"
  },
  "operations":{
    "AddCustomAttributes":{
      "name":"AddCustomAttributes",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AddCustomAttributesRequest"},
      "output":{"shape":"AddCustomAttributesResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserImportInProgressException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Adds additional user attributes to the user pool schema.</p>"
    },
    "AdminAddUserToGroup":{
      "name":"AdminAddUserToGroup",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminAddUserToGroupRequest"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Adds the specified user to the specified group.</p> <p>Requires developer credentials.</p>"
    },
    "AdminConfirmSignUp":{
      "name":"AdminConfirmSignUp",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminConfirmSignUpRequest"},
      "output":{"shape":"AdminConfirmSignUpResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyFailedAttemptsException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Confirms user registration as an admin without using a confirmation code. Works on any user.</p> <p>Requires developer credentials.</p>"
    },
    "AdminCreateUser":{
      "name":"AdminCreateUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminCreateUserRequest"},
      "output":{"shape":"AdminCreateUserResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UsernameExistsException"},
        {"shape":"InvalidPasswordException"},
        {"shape":"CodeDeliveryFailureException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"PreconditionNotMetException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UnsupportedUserStateException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Creates a new user in the specified user pool and sends a welcome message via email or phone (SMS). This message is based on a template that you configured in your call to CreateUserPool or UpdateUserPool. This template includes your custom sign-up instructions and placeholders for user name and temporary password.</p> <p>Requires developer credentials.</p>"
    },
    "AdminDeleteUser":{
      "name":"AdminDeleteUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminDeleteUserRequest"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Deletes a user as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"
    },
    "AdminDeleteUserAttributes":{
      "name":"AdminDeleteUserAttributes",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminDeleteUserAttributesRequest"},
      "output":{"shape":"AdminDeleteUserAttributesResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Deletes the user attributes in a user pool as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"
    },
    "AdminDisableProviderForUser":{
      "name":"AdminDisableProviderForUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminDisableProviderForUserRequest"},
      "output":{"shape":"AdminDisableProviderForUserResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"AliasExistsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "AdminDisableUser":{
      "name":"AdminDisableUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminDisableUserRequest"},
      "output":{"shape":"AdminDisableUserResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Disables the specified user as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"
    },
    "AdminEnableUser":{
      "name":"AdminEnableUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminEnableUserRequest"},
      "output":{"shape":"AdminEnableUserResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Enables the specified user as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"
    },
    "AdminForgetDevice":{
      "name":"AdminForgetDevice",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminForgetDeviceRequest"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Forgets the device, as an administrator.</p> <p>Requires developer credentials.</p>"
    },
    "AdminGetDevice":{
      "name":"AdminGetDevice",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminGetDeviceRequest"},
      "output":{"shape":"AdminGetDeviceResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"},
        {"shape":"NotAuthorizedException"}
      ],
      "documentation":"<p>Gets the device, as an administrator.</p> <p>Requires developer credentials.</p>"
    },
    "AdminGetUser":{
      "name":"AdminGetUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminGetUserRequest"},
      "output":{"shape":"AdminGetUserResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Gets the specified user by user name in a user pool as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"
    },
    "AdminInitiateAuth":{
      "name":"AdminInitiateAuth",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminInitiateAuthRequest"},
      "output":{"shape":"AdminInitiateAuthResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"MFAMethodNotFoundException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"}
      ],
      "documentation":"<p>Initiates the authentication flow, as an administrator.</p> <p>Requires developer credentials.</p>"
    },
    "AdminLinkProviderForUser":{
      "name":"AdminLinkProviderForUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminLinkProviderForUserRequest"},
      "output":{"shape":"AdminLinkProviderForUserResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"AliasExistsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "AdminListDevices":{
      "name":"AdminListDevices",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminListDevicesRequest"},
      "output":{"shape":"AdminListDevicesResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"},
        {"shape":"NotAuthorizedException"}
      ],
      "documentation":"<p>Lists devices, as an administrator.</p> <p>Requires developer credentials.</p>"
    },
    "AdminListGroupsForUser":{
      "name":"AdminListGroupsForUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminListGroupsForUserRequest"},
      "output":{"shape":"AdminListGroupsForUserResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Lists the groups that the user belongs to.</p> <p>Requires developer credentials.</p>"
    },
    "AdminListUserAuthEvents":{
      "name":"AdminListUserAuthEvents",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminListUserAuthEventsRequest"},
      "output":{"shape":"AdminListUserAuthEventsResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserPoolAddOnNotEnabledException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "AdminRemoveUserFromGroup":{
      "name":"AdminRemoveUserFromGroup",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminRemoveUserFromGroupRequest"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Removes the specified user from the specified group.</p> <p>Requires developer credentials.</p>"
    },
    "AdminResetUserPassword":{
      "name":"AdminResetUserPassword",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminResetUserPasswordRequest"},
      "output":{"shape":"AdminResetUserPasswordResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidEmailRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Resets the specified user's password in a user pool as an administrator. Works on any user.</p> <p>When a developer calls this API, the current password is invalidated, so it must be changed. If a user tries to sign in after the API is called, the app will get a PasswordResetRequiredException exception back and should direct the user down the flow to reset the password, which is the same as the forgot password flow. In addition, if the user pool has phone verification selected and a verified phone number exists for the user, or if email verification is selected and a verified email exists for the user, calling this API will also result in sending a message to the end user with the code to change their password.</p> <p>Requires developer credentials.</p>"
    },
    "AdminRespondToAuthChallenge":{
      "name":"AdminRespondToAuthChallenge",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminRespondToAuthChallengeRequest"},
      "output":{"shape":"AdminRespondToAuthChallengeResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"CodeMismatchException"},
        {"shape":"ExpiredCodeException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"InvalidPasswordException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"InternalErrorException"},
        {"shape":"MFAMethodNotFoundException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"AliasExistsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"SoftwareTokenMFANotFoundException"}
      ],
      "documentation":"<p>Responds to an authentication challenge, as an administrator.</p> <p>Requires developer credentials.</p>"
    },
    "AdminSetUserMFAPreference":{
      "name":"AdminSetUserMFAPreference",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminSetUserMFAPreferenceRequest"},
      "output":{"shape":"AdminSetUserMFAPreferenceResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "AdminSetUserSettings":{
      "name":"AdminSetUserSettings",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminSetUserSettingsRequest"},
      "output":{"shape":"AdminSetUserSettingsResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Sets all the user settings for a specified user name. Works on any user.</p> <p>Requires developer credentials.</p>"
    },
    "AdminUpdateAuthEventFeedback":{
      "name":"AdminUpdateAuthEventFeedback",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminUpdateAuthEventFeedbackRequest"},
      "output":{"shape":"AdminUpdateAuthEventFeedbackResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserPoolAddOnNotEnabledException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "AdminUpdateDeviceStatus":{
      "name":"AdminUpdateDeviceStatus",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminUpdateDeviceStatusRequest"},
      "output":{"shape":"AdminUpdateDeviceStatusResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Updates the device status as an administrator.</p> <p>Requires developer credentials.</p>"
    },
    "AdminUpdateUserAttributes":{
      "name":"AdminUpdateUserAttributes",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminUpdateUserAttributesRequest"},
      "output":{"shape":"AdminUpdateUserAttributesResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"AliasExistsException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Updates the specified user's attributes, including developer attributes, as an administrator. Works on any user.</p> <p>In addition to updating user attributes, this API can also be used to mark phone and email as verified.</p> <p>Requires developer credentials.</p>"
    },
    "AdminUserGlobalSignOut":{
      "name":"AdminUserGlobalSignOut",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AdminUserGlobalSignOutRequest"},
      "output":{"shape":"AdminUserGlobalSignOutResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Signs out users from all devices, as an administrator.</p> <p>Requires developer credentials.</p>"
    },
    "AssociateSoftwareToken":{
      "name":"AssociateSoftwareToken",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AssociateSoftwareTokenRequest"},
      "output":{"shape":"AssociateSoftwareTokenResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"InternalErrorException"},
        {"shape":"SoftwareTokenMFANotFoundException"}
      ]
    },
    "Authenticate":{
      "name":"Authenticate",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"AuthenticateRequest"},
      "output":{"shape":"AuthenticateResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"MFAMethodNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"InvalidEmailRoleAccessPolicyException"},
        {"shape":"CodeDeliveryFailureException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>The second step in the authentication flow of Secure Remote Password protocol (SRP) for authenticating a user to get ID, access and refresh tokens. To learn more about the first step, see <a href=\"API_GetAuthenticationDetails.html\">GetAuthenticationDetails</a>.</p>",
      "authtype":"none"
    },
    "ChangePassword":{
      "name":"ChangePassword",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ChangePasswordRequest"},
      "output":{"shape":"ChangePasswordResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"InvalidPasswordException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Changes the password for a specified user in a user pool.</p>",
      "authtype":"none"
    },
    "ConfirmDevice":{
      "name":"ConfirmDevice",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ConfirmDeviceRequest"},
      "output":{"shape":"ConfirmDeviceResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidPasswordException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"UsernameExistsException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Confirms tracking of the device. This API call is the call that begins device tracking.</p>"
    },
    "ConfirmForgotPassword":{
      "name":"ConfirmForgotPassword",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ConfirmForgotPasswordRequest"},
      "output":{"shape":"ConfirmForgotPasswordResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidParameterException"},
        {"shape":"InvalidPasswordException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"CodeMismatchException"},
        {"shape":"ExpiredCodeException"},
        {"shape":"TooManyFailedAttemptsException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Allows a user to enter a confirmation code to reset a forgotten password.</p>",
      "authtype":"none"
    },
    "ConfirmSignUp":{
      "name":"ConfirmSignUp",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ConfirmSignUpRequest"},
      "output":{"shape":"ConfirmSignUpResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyFailedAttemptsException"},
        {"shape":"CodeMismatchException"},
        {"shape":"ExpiredCodeException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"AliasExistsException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Confirms registration of a user and handles the existing alias from a previous user.</p>",
      "authtype":"none"
    },
    "CreateGroup":{
      "name":"CreateGroup",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"CreateGroupRequest"},
      "output":{"shape":"CreateGroupResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"GroupExistsException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Creates a new group in the specified user pool.</p> <p>Requires developer credentials.</p>"
    },
    "CreateIdentityProvider":{
      "name":"CreateIdentityProvider",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"CreateIdentityProviderRequest"},
      "output":{"shape":"CreateIdentityProviderResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"DuplicateProviderException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "CreateResourceServer":{
      "name":"CreateResourceServer",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"CreateResourceServerRequest"},
      "output":{"shape":"CreateResourceServerResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "CreateUserImportJob":{
      "name":"CreateUserImportJob",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"CreateUserImportJobRequest"},
      "output":{"shape":"CreateUserImportJobResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PreconditionNotMetException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"LimitExceededException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Creates the user import job.</p>"
    },
    "CreateUserPool":{
      "name":"CreateUserPool",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"CreateUserPoolRequest"},
      "output":{"shape":"CreateUserPoolResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"InvalidEmailRoleAccessPolicyException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserPoolTaggingException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Creates a new Amazon Cognito user pool and sets the password policy for the pool.</p>"
    },
    "CreateUserPoolClient":{
      "name":"CreateUserPoolClient",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"CreateUserPoolClientRequest"},
      "output":{"shape":"CreateUserPoolClientResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"ScopeDoesNotExistException"},
        {"shape":"InvalidOAuthFlowException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Creates the user pool client.</p>"
    },
    "CreateUserPoolDomain":{
      "name":"CreateUserPoolDomain",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"CreateUserPoolDomainRequest"},
      "output":{"shape":"CreateUserPoolDomainResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "DeleteGroup":{
      "name":"DeleteGroup",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DeleteGroupRequest"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Deletes a group. Currently only groups with no members can be deleted.</p> <p>Requires developer credentials.</p>"
    },
    "DeleteIdentityProvider":{
      "name":"DeleteIdentityProvider",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DeleteIdentityProviderRequest"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"UnsupportedIdentityProviderException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "DeleteResourceServer":{
      "name":"DeleteResourceServer",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DeleteResourceServerRequest"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "DeleteUser":{
      "name":"DeleteUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DeleteUserRequest"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Allows a user to delete one's self.</p>",
      "authtype":"none"
    },
    "DeleteUserAttributes":{
      "name":"DeleteUserAttributes",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DeleteUserAttributesRequest"},
      "output":{"shape":"DeleteUserAttributesResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Deletes the attributes for a user.</p>",
      "authtype":"none"
    },
    "DeleteUserPool":{
      "name":"DeleteUserPool",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DeleteUserPoolRequest"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserImportInProgressException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Deletes the specified Amazon Cognito user pool.</p>"
    },
    "DeleteUserPoolClient":{
      "name":"DeleteUserPoolClient",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DeleteUserPoolClientRequest"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Allows the developer to delete the user pool client.</p>"
    },
    "DeleteUserPoolDomain":{
      "name":"DeleteUserPoolDomain",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DeleteUserPoolDomainRequest"},
      "output":{"shape":"DeleteUserPoolDomainResponse"},
      "errors":[
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "DescribeIdentityProvider":{
      "name":"DescribeIdentityProvider",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DescribeIdentityProviderRequest"},
      "output":{"shape":"DescribeIdentityProviderResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "DescribeResourceServer":{
      "name":"DescribeResourceServer",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DescribeResourceServerRequest"},
      "output":{"shape":"DescribeResourceServerResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "DescribeRiskConfiguration":{
      "name":"DescribeRiskConfiguration",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DescribeRiskConfigurationRequest"},
      "output":{"shape":"DescribeRiskConfigurationResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserPoolAddOnNotEnabledException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "DescribeUserImportJob":{
      "name":"DescribeUserImportJob",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DescribeUserImportJobRequest"},
      "output":{"shape":"DescribeUserImportJobResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Describes the user import job.</p>"
    },
    "DescribeUserPool":{
      "name":"DescribeUserPool",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DescribeUserPoolRequest"},
      "output":{"shape":"DescribeUserPoolResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserPoolTaggingException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Returns the configuration information and metadata of the specified user pool.</p>"
    },
    "DescribeUserPoolClient":{
      "name":"DescribeUserPoolClient",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DescribeUserPoolClientRequest"},
      "output":{"shape":"DescribeUserPoolClientResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Client method for returning the configuration information and metadata of the specified user pool client.</p>"
    },
    "DescribeUserPoolDomain":{
      "name":"DescribeUserPoolDomain",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"DescribeUserPoolDomainRequest"},
      "output":{"shape":"DescribeUserPoolDomainResponse"},
      "errors":[
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "EnhanceAuth":{
      "name":"EnhanceAuth",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"EnhanceAuthRequest"},
      "output":{"shape":"EnhanceAuthResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"CodeMismatchException"},
        {"shape":"ExpiredCodeException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Grants the ability to supply a multi-factor authentication (MFA) token for an MFA-enabled user to get the ID, access, and refresh tokens.</p>",
      "authtype":"none"
    },
    "ForgetDevice":{
      "name":"ForgetDevice",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ForgetDeviceRequest"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Forgets the specified device.</p>"
    },
    "ForgotPassword":{
      "name":"ForgotPassword",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ForgotPasswordRequest"},
      "output":{"shape":"ForgotPasswordResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"InvalidEmailRoleAccessPolicyException"},
        {"shape":"CodeDeliveryFailureException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Calling this API causes a message to be sent to the end user with a confirmation code that is required to change the user's password. For the <code>Username</code> parameter, you can use the username or user alias. If a verified phone number exists for the user, the confirmation code is sent to the phone number. Otherwise, if a verified email exists, the confirmation code is sent to the email. If neither a verified phone number nor a verified email exists, <code>InvalidParameterException</code> is thrown. To use the confirmation code for resetting the password, call <a href=\"API_ConfirmForgotPassword.html\">ConfirmForgotPassword</a>.</p>",
      "authtype":"none"
    },
    "GetAuthenticationDetails":{
      "name":"GetAuthenticationDetails",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetAuthenticationDetailsRequest"},
      "output":{"shape":"GetAuthenticationDetailsResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>First step of the Secure Remote Password protocol (SRP) auth flow to authenticate a user. To learn about the second step, see <a href=\"API_Authenticate.html\">Authenticate</a>.</p>",
      "authtype":"none"
    },
    "GetCSVHeader":{
      "name":"GetCSVHeader",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetCSVHeaderRequest"},
      "output":{"shape":"GetCSVHeaderResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Gets the header information for the .csv file to be used as input for the user import job.</p>"
    },
    "GetDevice":{
      "name":"GetDevice",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetDeviceRequest"},
      "output":{"shape":"GetDeviceResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Gets the device.</p>"
    },
    "GetGroup":{
      "name":"GetGroup",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetGroupRequest"},
      "output":{"shape":"GetGroupResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Gets a group.</p> <p>Requires developer credentials.</p>"
    },
    "GetIdentityProviderByIdentifier":{
      "name":"GetIdentityProviderByIdentifier",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetIdentityProviderByIdentifierRequest"},
      "output":{"shape":"GetIdentityProviderByIdentifierResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "GetJWKS":{
      "name":"GetJWKS",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetJWKSRequest"},
      "output":{"shape":"GetJWKSResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InvalidParameterException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Gets the JSON Web keys for the specified user pool.</p>",
      "authtype":"none"
    },
    "GetOpenIdConfiguration":{
      "name":"GetOpenIdConfiguration",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetOpenIdConfigurationRequest"},
      "output":{"shape":"GetOpenIdConfigurationResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InvalidParameterException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Gets the OpenId configuration information for the specified user pool.</p>",
      "authtype":"none"
    },
    "GetSigningCertificate":{
      "name":"GetSigningCertificate",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetSigningCertificateRequest"},
      "output":{"shape":"GetSigningCertificateResponse"},
      "errors":[
        {"shape":"InternalErrorException"},
        {"shape":"ResourceNotFoundException"}
      ]
    },
    "GetUICustomization":{
      "name":"GetUICustomization",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetUICustomizationRequest"},
      "output":{"shape":"GetUICustomizationResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "GetUser":{
      "name":"GetUser",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetUserRequest"},
      "output":{"shape":"GetUserResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Gets the user attributes and metadata for a user.</p>",
      "authtype":"none"
    },
    "GetUserAttributeVerificationCode":{
      "name":"GetUserAttributeVerificationCode",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetUserAttributeVerificationCodeRequest"},
      "output":{"shape":"GetUserAttributeVerificationCodeResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"InvalidEmailRoleAccessPolicyException"},
        {"shape":"CodeDeliveryFailureException"},
        {"shape":"LimitExceededException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Gets the user attribute verification code for the specified attribute name.</p>",
      "authtype":"none"
    },
    "GetUserPoolMfaConfig":{
      "name":"GetUserPoolMfaConfig",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetUserPoolMfaConfigRequest"},
      "output":{"shape":"GetUserPoolMfaConfigResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "GetUserPoolUIConfiguration":{
      "name":"GetUserPoolUIConfiguration",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GetUserPoolUIConfigurationRequest"},
      "output":{"shape":"GetUserPoolUIConfigurationResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "GlobalSignOut":{
      "name":"GlobalSignOut",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"GlobalSignOutRequest"},
      "output":{"shape":"GlobalSignOutResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Signs out users from all devices.</p>"
    },
    "InitiateAuth":{
      "name":"InitiateAuth",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"InitiateAuthRequest"},
      "output":{"shape":"InitiateAuthResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Initiates the authentication flow.</p>"
    },
    "ListDevices":{
      "name":"ListDevices",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ListDevicesRequest"},
      "output":{"shape":"ListDevicesResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Lists the devices.</p>"
    },
    "ListGroups":{
      "name":"ListGroups",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ListGroupsRequest"},
      "output":{"shape":"ListGroupsResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Lists the groups associated with a user pool.</p> <p>Requires developer credentials.</p>"
    },
    "ListIdentityProviders":{
      "name":"ListIdentityProviders",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ListIdentityProvidersRequest"},
      "output":{"shape":"ListIdentityProvidersResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "ListResourceServers":{
      "name":"ListResourceServers",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ListResourceServersRequest"},
      "output":{"shape":"ListResourceServersResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "ListUserImportJobs":{
      "name":"ListUserImportJobs",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ListUserImportJobsRequest"},
      "output":{"shape":"ListUserImportJobsResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Lists the user import jobs.</p>"
    },
    "ListUserPoolClients":{
      "name":"ListUserPoolClients",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ListUserPoolClientsRequest"},
      "output":{"shape":"ListUserPoolClientsResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Lists the clients that have been created for the specified user pool.</p>"
    },
    "ListUserPools":{
      "name":"ListUserPools",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ListUserPoolsRequest"},
      "output":{"shape":"ListUserPoolsResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Lists the user pools associated with an AWS account.</p>"
    },
    "ListUsers":{
      "name":"ListUsers",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ListUsersRequest"},
      "output":{"shape":"ListUsersResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Lists the users in the Amazon Cognito user pool.</p>"
    },
    "ListUsersInGroup":{
      "name":"ListUsersInGroup",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ListUsersInGroupRequest"},
      "output":{"shape":"ListUsersInGroupResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Lists the users in the specified group.</p> <p>Requires developer credentials.</p>"
    },
    "RefreshTokens":{
      "name":"RefreshTokens",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"RefreshTokensRequest"},
      "output":{"shape":"RefreshTokensResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Refreshes the tokens for the specified client ID.</p>",
      "authtype":"none"
    },
    "ResendConfirmationCode":{
      "name":"ResendConfirmationCode",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"ResendConfirmationCodeRequest"},
      "output":{"shape":"ResendConfirmationCodeResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"InvalidEmailRoleAccessPolicyException"},
        {"shape":"CodeDeliveryFailureException"},
        {"shape":"UserNotFoundException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Resends the confirmation (for confirmation of registration) to a specific user in the user pool.</p>",
      "authtype":"none"
    },
    "RespondToAuthChallenge":{
      "name":"RespondToAuthChallenge",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"RespondToAuthChallengeRequest"},
      "output":{"shape":"RespondToAuthChallengeResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"CodeMismatchException"},
        {"shape":"ExpiredCodeException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidPasswordException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"MFAMethodNotFoundException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"AliasExistsException"},
        {"shape":"InternalErrorException"},
        {"shape":"SoftwareTokenMFANotFoundException"}
      ],
      "documentation":"<p>Responds to the authentication challenge.</p>"
    },
    "SetRiskConfiguration":{
      "name":"SetRiskConfiguration",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"SetRiskConfigurationRequest"},
      "output":{"shape":"SetRiskConfigurationResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserPoolAddOnNotEnabledException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "SetUICustomization":{
      "name":"SetUICustomization",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"SetUICustomizationRequest"},
      "output":{"shape":"SetUICustomizationResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "SetUserMFAPreference":{
      "name":"SetUserMFAPreference",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"SetUserMFAPreferenceRequest"},
      "output":{"shape":"SetUserMFAPreferenceResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "SetUserPoolMfaConfig":{
      "name":"SetUserPoolMfaConfig",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"SetUserPoolMfaConfigRequest"},
      "output":{"shape":"SetUserPoolMfaConfigResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "SetUserPoolUIConfiguration":{
      "name":"SetUserPoolUIConfiguration",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"SetUserPoolUIConfigurationRequest"},
      "output":{"shape":"SetUserPoolUIConfigurationResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "SetUserSettings":{
      "name":"SetUserSettings",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"SetUserSettingsRequest"},
      "output":{"shape":"SetUserSettingsResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Sets the user settings like multi-factor authentication (MFA). If MFA is to be removed for a particular attribute pass the attribute with code delivery as null. If null list is passed, all MFA options are removed.</p>",
      "authtype":"none"
    },
    "SignUp":{
      "name":"SignUp",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"SignUpRequest"},
      "output":{"shape":"SignUpResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidPasswordException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"UsernameExistsException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"InvalidEmailRoleAccessPolicyException"},
        {"shape":"CodeDeliveryFailureException"}
      ],
      "documentation":"<p>Registers the user in the specified user pool and creates a user name, password, and user attributes.</p>",
      "authtype":"none"
    },
    "StartUserImportJob":{
      "name":"StartUserImportJob",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"StartUserImportJobRequest"},
      "output":{"shape":"StartUserImportJobResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"},
        {"shape":"PreconditionNotMetException"},
        {"shape":"NotAuthorizedException"}
      ],
      "documentation":"<p>Starts the user import.</p>"
    },
    "StopUserImportJob":{
      "name":"StopUserImportJob",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"StopUserImportJobRequest"},
      "output":{"shape":"StopUserImportJobResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"},
        {"shape":"PreconditionNotMetException"},
        {"shape":"NotAuthorizedException"}
      ],
      "documentation":"<p>Stops the user import job.</p>"
    },
    "UpdateAuthEventFeedback":{
      "name":"UpdateAuthEventFeedback",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"UpdateAuthEventFeedbackRequest"},
      "output":{"shape":"UpdateAuthEventFeedbackResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserPoolAddOnNotEnabledException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "UpdateDeviceStatus":{
      "name":"UpdateDeviceStatus",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"UpdateDeviceStatusRequest"},
      "output":{"shape":"UpdateDeviceStatusResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Updates the device status.</p>"
    },
    "UpdateGroup":{
      "name":"UpdateGroup",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"UpdateGroupRequest"},
      "output":{"shape":"UpdateGroupResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Updates the specified group with the specified attributes.</p> <p>Requires developer credentials.</p>"
    },
    "UpdateIdentityProvider":{
      "name":"UpdateIdentityProvider",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"UpdateIdentityProviderRequest"},
      "output":{"shape":"UpdateIdentityProviderResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"UnsupportedIdentityProviderException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "UpdateResourceServer":{
      "name":"UpdateResourceServer",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"UpdateResourceServerRequest"},
      "output":{"shape":"UpdateResourceServerResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"InternalErrorException"}
      ]
    },
    "UpdateUserAttributes":{
      "name":"UpdateUserAttributes",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"UpdateUserAttributesRequest"},
      "output":{"shape":"UpdateUserAttributesResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"CodeMismatchException"},
        {"shape":"ExpiredCodeException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UnexpectedLambdaException"},
        {"shape":"UserLambdaValidationException"},
        {"shape":"InvalidLambdaResponseException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"AliasExistsException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"InvalidEmailRoleAccessPolicyException"},
        {"shape":"CodeDeliveryFailureException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Allows a user to update a specific attribute (one at a time).</p>",
      "authtype":"none"
    },
    "UpdateUserPool":{
      "name":"UpdateUserPool",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"UpdateUserPoolRequest"},
      "output":{"shape":"UpdateUserPoolResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"ConcurrentModificationException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"UserImportInProgressException"},
        {"shape":"InternalErrorException"},
        {"shape":"InvalidSmsRoleAccessPolicyException"},
        {"shape":"InvalidSmsRoleTrustRelationshipException"},
        {"shape":"UserPoolTaggingException"},
        {"shape":"InvalidEmailRoleAccessPolicyException"}
      ],
      "documentation":"<p>Updates the specified user pool with the specified attributes.</p>"
    },
    "UpdateUserPoolClient":{
      "name":"UpdateUserPoolClient",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"UpdateUserPoolClientRequest"},
      "output":{"shape":"UpdateUserPoolClientResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"ScopeDoesNotExistException"},
        {"shape":"InvalidOAuthFlowException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Allows the developer to update the specified user pool client and password policy.</p>"
    },
    "VerifySoftwareToken":{
      "name":"VerifySoftwareToken",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"VerifySoftwareTokenRequest"},
      "output":{"shape":"VerifySoftwareTokenResponse"},
      "errors":[
        {"shape":"InvalidParameterException"},
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidUserPoolConfigurationException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"},
        {"shape":"EnableSoftwareTokenMFAException"},
        {"shape":"SoftwareTokenMFANotFoundException"},
        {"shape":"CodeMismatchException"}
      ]
    },
    "VerifyUserAttribute":{
      "name":"VerifyUserAttribute",
      "http":{
        "method":"POST",
        "requestUri":"/"
      },
      "input":{"shape":"VerifyUserAttributeRequest"},
      "output":{"shape":"VerifyUserAttributeResponse"},
      "errors":[
        {"shape":"ResourceNotFoundException"},
        {"shape":"InvalidParameterException"},
        {"shape":"CodeMismatchException"},
        {"shape":"ExpiredCodeException"},
        {"shape":"NotAuthorizedException"},
        {"shape":"TooManyRequestsException"},
        {"shape":"LimitExceededException"},
        {"shape":"PasswordResetRequiredException"},
        {"shape":"UserNotFoundException"},
        {"shape":"UserNotConfirmedException"},
        {"shape":"InternalErrorException"}
      ],
      "documentation":"<p>Verifies the specified user attributes in the user pool.</p>",
      "authtype":"none"
    }
  },
  "shapes":{
    "AValueHexStringType":{
      "type":"string",
      "max":1024,
      "min":1,
      "pattern":"^[0-9a-fA-F]+$"
    },
    "AWSAccountIdType":{"type":"string"},
    "AccountTakeoverActionNotifyType":{"type":"boolean"},
    "AccountTakeoverActionType":{
      "type":"structure",
      "required":[
        "Notify",
        "EventAction"
      ],
      "members":{
        "Notify":{"shape":"AccountTakeoverActionNotifyType"},
        "EventAction":{"shape":"AccountTakeoverEventActionType"}
      }
    },
    "AccountTakeoverActionsType":{
      "type":"structure",
      "members":{
        "LowAction":{"shape":"AccountTakeoverActionType"},
        "MediumAction":{"shape":"AccountTakeoverActionType"},
        "HighAction":{"shape":"AccountTakeoverActionType"}
      }
    },
    "AccountTakeoverEventActionType":{
      "type":"string",
      "enum":[
        "BLOCK",
        "MFA_IF_CONFIGURED",
        "MFA_REQUIRED",
        "NO_ACTION"
      ]
    },
    "AccountTakeoverRiskConfigurationType":{
      "type":"structure",
      "required":["Actions"],
      "members":{
        "NotifyConfiguration":{"shape":"NotifyConfigurationType"},
        "Actions":{"shape":"AccountTakeoverActionsType"}
      }
    },
    "AddCustomAttributesRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "CustomAttributes"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to add custom attributes.</p>"
        },
        "CustomAttributes":{
          "shape":"CustomAttributesListType",
          "documentation":"<p>An array of custom attributes, such as Mutable and Name.</p>"
        }
      },
      "documentation":"<p>Represents the request to add custom attributes.</p>"
    },
    "AddCustomAttributesResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response from the server for the request to add custom attributes.</p>"
    },
    "AdminAddUserToGroupRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username",
        "GroupName"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The username for the user.</p>"
        },
        "GroupName":{
          "shape":"GroupNameType",
          "documentation":"<p>The group name.</p>"
        }
      }
    },
    "AdminConfirmSignUpRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for which you want to confirm user registration.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name for which you want to confirm user registration.</p>"
        }
      },
      "documentation":"<p>Represents the request to confirm user registration.</p>"
    },
    "AdminConfirmSignUpResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response from the server for the request to confirm registration.</p>"
    },
    "AdminCreateUserConfigType":{
      "type":"structure",
      "members":{
        "AllowAdminCreateUserOnly":{
          "shape":"BooleanType",
          "documentation":"<p>Set to True if only the administrator is allowed to create user profiles. Set to False if users can sign themselves up via an app.</p>"
        },
        "UnusedAccountValidityDays":{
          "shape":"AdminCreateUserUnusedAccountValidityDaysType",
          "documentation":"<p>The user account expiration limit, in days, after which the account is no longer usable. To reset the account after that time limit, you must call AdminCreateUser again, specifying \"RESEND\" for the MessageAction parameter. The default value for this parameter is 7.</p>"
        },
        "InviteMessageTemplate":{
          "shape":"MessageTemplateType",
          "documentation":"<p>The message template to be used for the welcome message to new users.</p>"
        }
      },
      "documentation":"<p>The type of configuration for creating a new user profile.</p>"
    },
    "AdminCreateUserRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where the user will be created.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The username for the user. Must be unique within the user pool. Must be a UTF-8 string between 1 and 128 characters. After the user is created, the username cannot be changed.</p>"
        },
        "UserAttributes":{
          "shape":"AttributeListType",
          "documentation":"<p>An array of name-value pairs that contain user attributes and attribute values to be set for the user to be created. You can create a user without specifying any attributes other than Username. However, any attributes that you specify as required (in CreateUserPool or in the <b>Attributes</b> tab of the console) must be supplied either by you (in your call to AdminCreateUser) or by the user (when he or she signs up in response to your welcome message).</p> <p>To send a message inviting the user to sign up, you must specify the user's email address or phone number. This can be done in your call to AdminCreateUser or in the <b>Users</b> tab of the Amazon Cognito console for managing your user pools.</p> <p>In your call to AdminCreateUser, you can set the email_verified attribute to True, and you can set the phone_number_verified attribute to True. (You also do this by calling <a href=\"API_AdminUpdateUserAttributes.html\">AdminUpdateUserAttributes</a>.)</p> <ul> <li> <p> <b>email</b>: The email address of the user to whom the message that contains the code and username will be sent. Required if the email_verified attribute is set to True, or if \"EMAIL\" is specified in the DesiredDeliveryMediums parameter.</p> </li> <li> <p> <b>phone_number</b>: The phone number of the user to whom the message that contains the code and username will be sent. Required if the phone_number_verified attribute is set to True, or if \"SMS\" is specified in the DesiredDeliveryMediums parameter.</p> </li> </ul>"
        },
        "ValidationData":{
          "shape":"AttributeListType",
          "documentation":"<p>The user's validation data. This is an array of name-value pairs that contain user attributes and attribute values that you can use for custom validation, such as restricting the types of user accounts that can be registered. For example, you might choose to allow or disallow user sign-up based on the user's domain.</p> <p>To configure custom validation, you must create a Pre Sign-up Lambda trigger for the user pool as described in the Amazon Cognito Developer Guide. The Lambda trigger receives the validation data and uses it in the validation process.</p> <p>The user's validation data is not persisted.</p>"
        },
        "TemporaryPassword":{
          "shape":"PasswordType",
          "documentation":"<p>The user's temporary password. This password must conform to the password policy that you specified when you created the user pool.</p> <p>The temporary password is valid only once. To complete the Admin Create User flow, the user must enter the temporary password in the sign-in page along with a new password to be used in all future sign-ins.</p> <p>This parameter is not required. If you do not specify a value, Amazon Cognito generates one for you.</p> <p>The temporary password can only be used until the user account expiration limit that you specified when you created the user pool. To reset the account after that time limit, you must call AdminCreateUser again, specifying \"RESEND\" for the MessageAction parameter.</p>"
        },
        "ForceAliasCreation":{
          "shape":"ForceAliasCreation",
          "documentation":"<p>This parameter is only used if the phone_number_verified or email_verified attribute is set to True. Otherwise, it is ignored.</p> <p>If this parameter is set to True and the phone number or email address specified in the UserAttributes parameter already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user. The previous user will no longer be able to log in using that alias.</p> <p>If this parameter is set to False, the API throws an AliasExistsException error if the alias already exists. The default value is False.</p>"
        },
        "MessageAction":{
          "shape":"MessageActionType",
          "documentation":"<p>Set to \"RESEND\" to resend the invitation message to a user that already exists and reset the expiration limit on the user's account. Set to \"SUPPRESS\" to suppress sending the message. Only one value can be specified.</p>"
        },
        "DesiredDeliveryMediums":{
          "shape":"DeliveryMediumListType",
          "documentation":"<p>Specify \"EMAIL\" if email will be used to send the welcome message. Specify \"SMS\" if the phone number will be used. The default value is \"SMS\". More than one value can be specified.</p>"
        }
      },
      "documentation":"<p>Represents the request to create a user in the specified user pool.</p>"
    },
    "AdminCreateUserResponse":{
      "type":"structure",
      "members":{
        "User":{
          "shape":"UserType",
          "documentation":"<p>The user returned in the request to create a new user.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to the request to create the user.</p>"
    },
    "AdminCreateUserUnusedAccountValidityDaysType":{
      "type":"integer",
      "max":365,
      "min":0
    },
    "AdminDeleteUserAttributesRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username",
        "UserAttributeNames"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to delete user attributes.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user from which you would like to delete attributes.</p>"
        },
        "UserAttributeNames":{
          "shape":"AttributeNameListType",
          "documentation":"<p>An array of strings representing the user attribute names you wish to delete.</p>"
        }
      },
      "documentation":"<p>Represents the request to delete user attributes as an administrator.</p>"
    },
    "AdminDeleteUserAttributesResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response received from the server for a request to delete user attributes.</p>"
    },
    "AdminDeleteUserRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to delete the user.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user you wish to delete.</p>"
        }
      },
      "documentation":"<p>Represents the request to delete a user as an administrator.</p>"
    },
    "AdminDisableProviderForUserRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "User"
      ],
      "members":{
        "UserPoolId":{"shape":"StringType"},
        "User":{"shape":"ProviderUserIdentifierType"}
      }
    },
    "AdminDisableProviderForUserResponse":{
      "type":"structure",
      "members":{
      }
    },
    "AdminDisableUserRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to disable the user.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user you wish to disable.</p>"
        }
      },
      "documentation":"<p>Represents the request to disable any user as an administrator.</p>"
    },
    "AdminDisableUserResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response received from the server to disable the user as an administrator.</p>"
    },
    "AdminEnableUserRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to enable the user.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user you wish to enable.</p>"
        }
      },
      "documentation":"<p>Represents the request that enables the user as an administrator.</p>"
    },
    "AdminEnableUserResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response from the server for the request to enable a user as an administrator.</p>"
    },
    "AdminForgetDeviceRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username",
        "DeviceKey"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name.</p>"
        },
        "DeviceKey":{
          "shape":"DeviceKeyType",
          "documentation":"<p>The device key.</p>"
        }
      },
      "documentation":"<p>Sends the forgot device request, as an administrator.</p>"
    },
    "AdminGetDeviceRequest":{
      "type":"structure",
      "required":[
        "DeviceKey",
        "UserPoolId",
        "Username"
      ],
      "members":{
        "DeviceKey":{
          "shape":"DeviceKeyType",
          "documentation":"<p>The device key.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name.</p>"
        }
      },
      "documentation":"<p>Represents the request to get the device, as an administrator.</p>"
    },
    "AdminGetDeviceResponse":{
      "type":"structure",
      "required":["Device"],
      "members":{
        "Device":{
          "shape":"DeviceType",
          "documentation":"<p>The device.</p>"
        }
      },
      "documentation":"<p>Gets the device response, as an administrator.</p>"
    },
    "AdminGetUserRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to get information about the user.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user you wish to retrieve.</p>"
        }
      },
      "documentation":"<p>Represents the request to get the specified user as an administrator.</p>"
    },
    "AdminGetUserResponse":{
      "type":"structure",
      "required":["Username"],
      "members":{
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user about whom you are receiving information.</p>"
        },
        "UserAttributes":{
          "shape":"AttributeListType",
          "documentation":"<p>An array of name-value pairs representing user attributes.</p>"
        },
        "UserCreateDate":{
          "shape":"DateType",
          "documentation":"<p>The date the user was created.</p>"
        },
        "UserLastModifiedDate":{
          "shape":"DateType",
          "documentation":"<p>The date the user was last modified.</p>"
        },
        "Enabled":{
          "shape":"BooleanType",
          "documentation":"<p>Indicates that the status is enabled.</p>"
        },
        "UserStatus":{
          "shape":"UserStatusType",
          "documentation":"<p>The user status. Can be one of the following:</p> <ul> <li> <p>UNCONFIRMED - User has been created but not confirmed.</p> </li> <li> <p>CONFIRMED - User has been confirmed.</p> </li> <li> <p>ARCHIVED - User is no longer active.</p> </li> <li> <p>COMPROMISED - User is disabled due to a potential security threat.</p> </li> <li> <p>UNKNOWN - User status is not known.</p> </li> </ul>"
        },
        "MFAOptions":{
          "shape":"MFAOptionListType",
          "documentation":"<p>Specifies the options for MFA (e.g., email or phone number).</p>"
        }
      },
      "documentation":"<p>Represents the response from the server from the request to get the specified user as an administrator.</p>"
    },
    "AdminInitiateAuthRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ClientId",
        "AuthFlow"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The ID of the Amazon Cognito user pool.</p>"
        },
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The app client ID.</p>"
        },
        "AuthFlow":{
          "shape":"AuthFlowType",
          "documentation":"<p>The authentication flow for this call to execute. The API action will depend on this value. For example:</p> <ul> <li> <p> <code>REFRESH_TOKEN_AUTH</code> will take in a valid refresh token and return new tokens.</p> </li> <li> <p> <code>USER_SRP_AUTH</code> will take in <code>USERNAME</code> and <code>SRPA</code> and return the SRP variables to be used for next challenge execution.</p> </li> </ul> <p>Valid values include:</p> <ul> <li> <p> <code>USER_SRP_AUTH</code>: Authentication flow for the Secure Remote Password (SRP) protocol.</p> </li> <li> <p> <code>REFRESH_TOKEN_AUTH</code>/<code>REFRESH_TOKEN</code>: Authentication flow for refreshing the access token and ID token by supplying a valid refresh token.</p> </li> <li> <p> <code>CUSTOM_AUTH</code>: Custom authentication flow.</p> </li> <li> <p> <code>ADMIN_NO_SRP_AUTH</code>: Non-SRP authentication flow; you can pass in the USERNAME and PASSWORD directly if the flow is enabled for calling the app client.</p> </li> </ul>"
        },
        "AuthParameters":{
          "shape":"AuthParametersType",
          "documentation":"<p>The authentication parameters. These are inputs corresponding to the <code>AuthFlow</code> that you are invoking. The required values depend on the value of <code>AuthFlow</code>:</p> <ul> <li> <p>For <code>USER_SRP_AUTH</code>: <code>USERNAME</code> (required), <code>SRPA</code> (required), <code>SECRET_HASH</code> (required if the app client is configured with a client secret), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>REFRESH_TOKEN_AUTH/REFRESH_TOKEN</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (required if the app client is configured with a client secret), <code>REFRESH_TOKEN</code> (required), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>ADMIN_NO_SRP_AUTH</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (if app client is configured with client secret), <code>PASSWORD</code> (required), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>CUSTOM_AUTH</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (if app client is configured with client secret), <code>DEVICE_KEY</code> </p> </li> </ul>"
        },
        "ClientMetadata":{
          "shape":"ClientMetadataType",
          "documentation":"<p>This is a random key-value pair map which can contain any key and will be passed to your PreAuthentication Lambda trigger as-is. It can be used to implement additional validations around authentication.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"},
        "ContextData":{"shape":"ContextDataType"}
      },
      "documentation":"<p>Initiates the authorization request, as an administrator.</p>"
    },
    "AdminInitiateAuthResponse":{
      "type":"structure",
      "members":{
        "ChallengeName":{
          "shape":"ChallengeNameType",
          "documentation":"<p>The name of the challenge which you are responding to with this call. This is returned to you in the <code>AdminInitiateAuth</code> response if you need to pass another challenge.</p> <ul> <li> <p> <code>SMS_MFA</code>: Next challenge is to supply an <code>SMS_MFA_CODE</code>, delivered via SMS.</p> </li> <li> <p> <code>PASSWORD_VERIFIER</code>: Next challenge is to supply <code>PASSWORD_CLAIM_SIGNATURE</code>, <code>PASSWORD_CLAIM_SECRET_BLOCK</code>, and <code>TIMESTAMP</code> after the client-side SRP calculations.</p> </li> <li> <p> <code>CUSTOM_CHALLENGE</code>: This is returned if your custom authentication flow determines that the user should pass another challenge before tokens are issued.</p> </li> <li> <p> <code>DEVICE_SRP_AUTH</code>: If device tracking was enabled on your user pool and the previous challenges were passed, this challenge is returned so that Amazon Cognito can start tracking this device.</p> </li> <li> <p> <code>DEVICE_PASSWORD_VERIFIER</code>: Similar to <code>PASSWORD_VERIFIER</code>, but for devices only.</p> </li> <li> <p> <code>ADMIN_NO_SRP_AUTH</code>: This is returned if you need to authenticate with <code>USERNAME</code> and <code>PASSWORD</code> directly. An app client must be enabled to use this flow.</p> </li> <li> <p> <code>NEW_PASSWORD_REQUIRED</code>: For users which are required to change their passwords after successful first login. This challenge should be passed with <code>NEW_PASSWORD</code> and any other required attributes.</p> </li> </ul>"
        },
        "Session":{
          "shape":"SessionType",
          "documentation":"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>AdminInitiateAuth</code> or <code>AdminRespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>AdminRespondToAuthChallenge</code> API call.</p>"
        },
        "ChallengeParameters":{
          "shape":"ChallengeParametersType",
          "documentation":"<p>The challenge parameters. These are returned to you in the <code>AdminInitiateAuth</code> response if you need to pass another challenge. The responses in this parameter should be used to compute inputs to the next call (<code>AdminRespondToAuthChallenge</code>). </p> <p>All challenges require <code>USERNAME</code> and <code>SECRET_HASH</code> (if applicable).</p> <p>The value of the <code>USER_IF_FOR_SRP</code> attribute will be the user's actual username, not an alias (such as email address or phone number), even if you specified an alias in your call to <code>AdminInitiateAuth</code>. This is because, in the <code>AdminRespondToAuthChallenge</code> API <code>ChallengeResponses</code>, the <code>USERNAME</code> attribute cannot be an alias.</p>"
        },
        "AuthenticationResult":{
          "shape":"AuthenticationResultType",
          "documentation":"<p>The result of the authentication response. This is only returned if the caller does not need to pass another challenge. If the caller does need to pass another challenge before it gets tokens, <code>ChallengeName</code>, <code>ChallengeParameters</code>, and <code>Session</code> are returned.</p>"
        }
      },
      "documentation":"<p>Initiates the authentication response, as an administrator.</p>"
    },
    "AdminLinkProviderForUserRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "DestinationUser",
        "SourceUser"
      ],
      "members":{
        "UserPoolId":{"shape":"StringType"},
        "DestinationUser":{"shape":"ProviderUserIdentifierType"},
        "SourceUser":{"shape":"ProviderUserIdentifierType"}
      }
    },
    "AdminLinkProviderForUserResponse":{
      "type":"structure",
      "members":{
      }
    },
    "AdminListDevicesRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name.</p>"
        },
        "Limit":{
          "shape":"QueryLimitType",
          "documentation":"<p>The limit of the devices request.</p>"
        },
        "PaginationToken":{
          "shape":"SearchPaginationTokenType",
          "documentation":"<p>The pagination token.</p>"
        }
      },
      "documentation":"<p>Represents the request to list devices, as an administrator.</p>"
    },
    "AdminListDevicesResponse":{
      "type":"structure",
      "members":{
        "Devices":{
          "shape":"DeviceListType",
          "documentation":"<p>The devices in the list of devices response.</p>"
        },
        "PaginationToken":{
          "shape":"SearchPaginationTokenType",
          "documentation":"<p>The pagination token.</p>"
        }
      },
      "documentation":"<p>Lists the device's response, as an administrator.</p>"
    },
    "AdminListGroupsForUserRequest":{
      "type":"structure",
      "required":[
        "Username",
        "UserPoolId"
      ],
      "members":{
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The username for the user.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        },
        "Limit":{
          "shape":"QueryLimitType",
          "documentation":"<p>The limit of the request to list groups.</p>"
        },
        "NextToken":{
          "shape":"PaginationKey",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      }
    },
    "AdminListGroupsForUserResponse":{
      "type":"structure",
      "members":{
        "Groups":{
          "shape":"GroupListType",
          "documentation":"<p>The groups that the user belongs to.</p>"
        },
        "NextToken":{
          "shape":"PaginationKey",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      }
    },
    "AdminListUserAuthEventsRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Username":{"shape":"UsernameType"},
        "MaxResults":{"shape":"QueryLimitType"},
        "NextToken":{"shape":"PaginationKey"}
      }
    },
    "AdminListUserAuthEventsResponse":{
      "type":"structure",
      "members":{
        "AuthEvents":{"shape":"AuthEventsType"},
        "NextToken":{"shape":"PaginationKey"}
      }
    },
    "AdminRemoveUserFromGroupRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username",
        "GroupName"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The username for the user.</p>"
        },
        "GroupName":{
          "shape":"GroupNameType",
          "documentation":"<p>The group name.</p>"
        }
      }
    },
    "AdminResetUserPasswordRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to reset the user's password.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user whose password you wish to reset.</p>"
        }
      },
      "documentation":"<p>Represents the request to reset a user's password as an administrator.</p>"
    },
    "AdminResetUserPasswordResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response from the server to reset a user password as an administrator.</p>"
    },
    "AdminRespondToAuthChallengeRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ClientId",
        "ChallengeName"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The ID of the Amazon Cognito user pool.</p>"
        },
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The app client ID.</p>"
        },
        "ChallengeName":{
          "shape":"ChallengeNameType",
          "documentation":"<p>The challenge name. For more information, see <a href=\"API_AdminInitiateAuth.html\">AdminInitiateAuth</a>.</p>"
        },
        "ChallengeResponses":{
          "shape":"ChallengeResponsesType",
          "documentation":"<p>The challenge responses. These are inputs corresponding to the value of <code>ChallengeName</code>, for example:</p> <ul> <li> <p> <code>SMS_MFA</code>: <code>SMS_MFA_CODE</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret).</p> </li> <li> <p> <code>PASSWORD_VERIFIER</code>: <code>PASSWORD_CLAIM_SIGNATURE</code>, <code>PASSWORD_CLAIM_SECRET_BLOCK</code>, <code>TIMESTAMP</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret).</p> </li> <li> <p> <code>ADMIN_NO_SRP_AUTH</code>: <code>PASSWORD</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret). </p> </li> <li> <p> <code>NEW_PASSWORD_REQUIRED</code>: <code>NEW_PASSWORD</code>, any other required attributes, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret). </p> </li> </ul> <p>The value of the <code>USERNAME</code> attribute must be the user's actual username, not an alias (such as email address or phone number). To make this easier, the <code>AdminInitiateAuth</code> response includes the actual username value in the <code>USERNAMEUSER_ID_FOR_SRP</code> attribute, even if you specified an alias in your call to <code>AdminInitiateAuth</code>.</p>"
        },
        "Session":{
          "shape":"SessionType",
          "documentation":"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"},
        "ContextData":{"shape":"ContextDataType"}
      },
      "documentation":"<p>The request to respond to the authentication challenge, as an administrator.</p>"
    },
    "AdminRespondToAuthChallengeResponse":{
      "type":"structure",
      "members":{
        "ChallengeName":{
          "shape":"ChallengeNameType",
          "documentation":"<p>The name of the challenge. For more information, see <a href=\"API_AdminInitiateAuth.html\">AdminInitiateAuth</a>.</p>"
        },
        "Session":{
          "shape":"SessionType",
          "documentation":"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"
        },
        "ChallengeParameters":{
          "shape":"ChallengeParametersType",
          "documentation":"<p>The challenge parameters. For more information, see <a href=\"API_AdminInitiateAuth.html\">AdminInitiateAuth</a>.</p>"
        },
        "AuthenticationResult":{
          "shape":"AuthenticationResultType",
          "documentation":"<p>The result returned by the server in response to the authentication request.</p>"
        }
      },
      "documentation":"<p>Responds to the authentication challenge, as an administrator.</p>"
    },
    "AdminSetUserMFAPreferenceRequest":{
      "type":"structure",
      "required":[
        "Username",
        "UserPoolId"
      ],
      "members":{
        "SMSMfaSettings":{"shape":"SMSMfaSettingsType"},
        "SoftwareTokenMfaSettings":{"shape":"SoftwareTokenMfaSettingsType"},
        "Username":{"shape":"UsernameType"},
        "UserPoolId":{"shape":"UserPoolIdType"}
      }
    },
    "AdminSetUserMFAPreferenceResponse":{
      "type":"structure",
      "members":{
      }
    },
    "AdminSetUserSettingsRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username",
        "MFAOptions"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to set the user's settings, such as MFA options.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user for whom you wish to set user settings.</p>"
        },
        "MFAOptions":{
          "shape":"MFAOptionListType",
          "documentation":"<p>Specifies the options for MFA (e.g., email or phone number).</p>"
        }
      },
      "documentation":"<p>Represents the request to set user settings as an administrator.</p>"
    },
    "AdminSetUserSettingsResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response from the server to set user settings as an administrator.</p>"
    },
    "AdminUpdateAuthEventFeedbackRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username",
        "EventId",
        "FeedbackValue"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Username":{"shape":"UsernameType"},
        "EventId":{"shape":"EventIdType"},
        "FeedbackValue":{"shape":"FeedbackValueType"}
      }
    },
    "AdminUpdateAuthEventFeedbackResponse":{
      "type":"structure",
      "members":{
      }
    },
    "AdminUpdateDeviceStatusRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username",
        "DeviceKey"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID&gt;</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name.</p>"
        },
        "DeviceKey":{
          "shape":"DeviceKeyType",
          "documentation":"<p>The device key.</p>"
        },
        "DeviceRememberedStatus":{
          "shape":"DeviceRememberedStatusType",
          "documentation":"<p>The status indicating whether a device has been remembered or not.</p>"
        }
      },
      "documentation":"<p>The request to update the device status, as an administrator.</p>"
    },
    "AdminUpdateDeviceStatusResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>The status response from the request to update the device, as an administrator.</p>"
    },
    "AdminUpdateUserAttributesRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username",
        "UserAttributes"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to update user attributes.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user for whom you want to update user attributes.</p>"
        },
        "UserAttributes":{
          "shape":"AttributeListType",
          "documentation":"<p>An array of name-value pairs representing user attributes.</p>"
        }
      },
      "documentation":"<p>Represents the request to update the user's attributes as an administrator.</p>"
    },
    "AdminUpdateUserAttributesResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response from the server for the request to update user attributes as an administrator.</p>"
    },
    "AdminUserGlobalSignOutRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name.</p>"
        }
      },
      "documentation":"<p>The request to sign out of all devices, as an administrator.</p>"
    },
    "AdminUserGlobalSignOutResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>The global sign-out response, as an administrator.</p>"
    },
    "AdvancedSecurityModeType":{
      "type":"string",
      "enum":[
        "OFF",
        "AUDIT",
        "ENFORCED"
      ]
    },
    "AliasAttributeType":{
      "type":"string",
      "enum":[
        "phone_number",
        "email",
        "preferred_username"
      ]
    },
    "AliasAttributesListType":{
      "type":"list",
      "member":{"shape":"AliasAttributeType"}
    },
    "AliasExistsException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message sent to the user when an alias exists.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when a user tries to confirm the account with an email or phone number that has already been supplied as an alias from a different account. This exception tells user that an account with this email or phone already exists.</p>",
      "exception":true
    },
    "AnalyticsConfigurationType":{
      "type":"structure",
      "required":[
        "ApplicationId",
        "RoleArn",
        "ExternalId"
      ],
      "members":{
        "ApplicationId":{"shape":"HexStringType"},
        "RoleArn":{"shape":"ArnType"},
        "ExternalId":{"shape":"StringType"},
        "UserDataShared":{"shape":"BooleanType"}
      }
    },
    "AnalyticsMetadataType":{
      "type":"structure",
      "members":{
        "AnalyticsEndpointId":{"shape":"StringType"}
      }
    },
    "ArnType":{
      "type":"string",
      "max":2048,
      "min":20,
      "pattern":"arn:[\\w+=/,.@-]+:[\\w+=/,.@-]+:([\\w+=/,.@-]*)?:[0-9]+:[\\w+=/,.@-]+(:[\\w+=/,.@-]+)?(:[\\w+=/,.@-]+)?"
    },
    "AssociateSoftwareTokenRequest":{
      "type":"structure",
      "members":{
        "AccessToken":{"shape":"TokenModelType"},
        "Session":{"shape":"SessionType"}
      }
    },
    "AssociateSoftwareTokenResponse":{
      "type":"structure",
      "members":{
        "SecretCode":{"shape":"SecretCodeType"},
        "Session":{"shape":"SessionType"}
      }
    },
    "AttributeDataType":{
      "type":"string",
      "enum":[
        "String",
        "Number",
        "DateTime",
        "Boolean"
      ]
    },
    "AttributeListType":{
      "type":"list",
      "member":{"shape":"AttributeType"}
    },
    "AttributeMappingKeyType":{
      "type":"string",
      "max":32,
      "min":1
    },
    "AttributeMappingType":{
      "type":"map",
      "key":{"shape":"AttributeMappingKeyType"},
      "value":{"shape":"StringType"}
    },
    "AttributeNameListType":{
      "type":"list",
      "member":{"shape":"AttributeNameType"}
    },
    "AttributeNameType":{
      "type":"string",
      "max":32,
      "min":1,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"
    },
    "AttributeType":{
      "type":"structure",
      "required":["Name"],
      "members":{
        "Name":{
          "shape":"AttributeNameType",
          "documentation":"<p>The name of the attribute.</p>"
        },
        "Value":{
          "shape":"AttributeValueType",
          "documentation":"<p>The value of the attribute.</p>"
        }
      },
      "documentation":"<p>Specifies whether the attribute is standard or custom.</p>"
    },
    "AttributeValueType":{
      "type":"string",
      "max":2048,
      "sensitive":true
    },
    "AuthEventType":{
      "type":"structure",
      "members":{
        "EventId":{"shape":"StringType"},
        "EventType":{"shape":"EventType"},
        "CreationDate":{"shape":"DateType"},
        "EventResponse":{"shape":"EventResponseType"},
        "EventRisk":{"shape":"EventRiskType"},
        "ChallengeResponses":{"shape":"ChallengeResponseListType"},
        "EventContextData":{"shape":"EventContextDataType"},
        "EventFeedback":{"shape":"EventFeedbackType"}
      }
    },
    "AuthEventsType":{
      "type":"list",
      "member":{"shape":"AuthEventType"}
    },
    "AuthFlowType":{
      "type":"string",
      "enum":[
        "USER_SRP_AUTH",
        "REFRESH_TOKEN_AUTH",
        "REFRESH_TOKEN",
        "CUSTOM_AUTH",
        "ADMIN_NO_SRP_AUTH"
      ]
    },
    "AuthParametersType":{
      "type":"map",
      "key":{"shape":"StringType"},
      "value":{"shape":"StringType"}
    },
    "AuthStateType":{
      "type":"string",
      "pattern":"[A-Za-z0-9-_+/=]+",
      "sensitive":true
    },
    "AuthenticateRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "Username",
        "PasswordClaim"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "SecretHash":{
          "shape":"SecretHashType",
          "documentation":"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user you wish to authenticate.</p>"
        },
        "PasswordClaim":{
          "shape":"PasswordClaimType",
          "documentation":"<p>The password claim of the authentication request.</p>"
        },
        "Timestamp":{
          "shape":"DateType",
          "documentation":"<p>The timestamp of the authentication request.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"}
      },
      "documentation":"<p>Represents the request to authenticate.</p>"
    },
    "AuthenticateResponse":{
      "type":"structure",
      "members":{
        "AuthenticationResult":{
          "shape":"AuthenticationResultType",
          "documentation":"<p>The result of the authentication response.</p>"
        },
        "AuthState":{
          "shape":"AuthStateType",
          "documentation":"<p>The authorization state of the authentication response.</p>"
        },
        "CodeDeliveryDetails":{
          "shape":"CodeDeliveryDetailsType",
          "documentation":"<p>The code delivery details returned by the server in the response to the authentication request.</p>"
        }
      },
      "documentation":"<p>Represents the authentication response.</p>"
    },
    "AuthenticationResultType":{
      "type":"structure",
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token of the authentication result.</p>"
        },
        "ExpiresIn":{
          "shape":"IntegerType",
          "documentation":"<p>The expiration period of the authentication result.</p>"
        },
        "TokenType":{
          "shape":"StringType",
          "documentation":"<p>The token type of the authentication result.</p>"
        },
        "RefreshToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The refresh token of the authentication result.</p>"
        },
        "IdToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The ID token of the authentication result.</p>"
        },
        "NewDeviceMetadata":{
          "shape":"NewDeviceMetadataType",
          "documentation":"<p>The new device metadata from an authentication result.</p>"
        }
      },
      "documentation":"<p>The result type of the authentication result.</p>"
    },
    "BlobType":{"type":"blob"},
    "BlockedIPRangeListType":{
      "type":"list",
      "member":{"shape":"StringType"},
      "max":20
    },
    "BooleanType":{"type":"boolean"},
    "BotActionType":{
      "type":"structure",
      "required":["EventAction"],
      "members":{
        "EventAction":{"shape":"BotEventActionType"}
      }
    },
    "BotActionsType":{
      "type":"structure",
      "members":{
        "LowAction":{"shape":"BotActionType"},
        "MediumAction":{"shape":"BotActionType"},
        "HighAction":{"shape":"BotActionType"}
      }
    },
    "BotEventActionType":{
      "type":"string",
      "enum":[
        "BLOCK",
        "NO_ACTION"
      ]
    },
    "BotRiskConfigurationType":{
      "type":"structure",
      "required":["Actions"],
      "members":{
        "EventFilter":{"shape":"EventFiltersType"},
        "Actions":{"shape":"BotActionsType"}
      }
    },
    "CSSType":{"type":"string"},
    "CSSVersionType":{"type":"string"},
    "CallbackURLsListType":{
      "type":"list",
      "member":{"shape":"RedirectUrlType"},
      "max":100,
      "min":0
    },
    "ChallengeName":{
      "type":"string",
      "enum":[
        "Password",
        "Mfa"
      ]
    },
    "ChallengeNameType":{
      "type":"string",
      "enum":[
        "SMS_MFA",
        "SOFTWARE_TOKEN_MFA",
        "SELECT_MFA_TYPE",
        "MFA_SETUP",
        "PASSWORD_VERIFIER",
        "CUSTOM_CHALLENGE",
        "DEVICE_SRP_AUTH",
        "DEVICE_PASSWORD_VERIFIER",
        "ADMIN_NO_SRP_AUTH",
        "NEW_PASSWORD_REQUIRED"
      ]
    },
    "ChallengeParametersType":{
      "type":"map",
      "key":{"shape":"StringType"},
      "value":{"shape":"StringType"}
    },
    "ChallengeResponse":{
      "type":"string",
      "enum":[
        "Success",
        "Failure"
      ]
    },
    "ChallengeResponseListType":{
      "type":"list",
      "member":{"shape":"ChallengeResponseType"}
    },
    "ChallengeResponseType":{
      "type":"structure",
      "members":{
        "ChallengeName":{"shape":"ChallengeName"},
        "ChallengeResponse":{"shape":"ChallengeResponse"}
      }
    },
    "ChallengeResponsesType":{
      "type":"map",
      "key":{"shape":"StringType"},
      "value":{"shape":"StringType"}
    },
    "ChangePasswordRequest":{
      "type":"structure",
      "required":[
        "PreviousPassword",
        "ProposedPassword",
        "AccessToken"
      ],
      "members":{
        "PreviousPassword":{
          "shape":"PasswordType",
          "documentation":"<p>The old password in the change password request.</p>"
        },
        "ProposedPassword":{
          "shape":"PasswordType",
          "documentation":"<p>The new password in the change password request.</p>"
        },
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token in the change password request.</p>"
        }
      },
      "documentation":"<p>Represents the request to change a user password.</p>"
    },
    "ChangePasswordResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>The response from the server to the change password request.</p>"
    },
    "ClientIdType":{
      "type":"string",
      "max":128,
      "min":1,
      "pattern":"[\\w+]+",
      "sensitive":true
    },
    "ClientMetadataType":{
      "type":"map",
      "key":{"shape":"StringType"},
      "value":{"shape":"StringType"}
    },
    "ClientNameType":{
      "type":"string",
      "max":128,
      "min":1,
      "pattern":"[\\w\\s+=,.@-]+"
    },
    "ClientPermissionListType":{
      "type":"list",
      "member":{"shape":"ClientPermissionType"}
    },
    "ClientPermissionType":{
      "type":"string",
      "max":2048,
      "min":1
    },
    "ClientSecretType":{
      "type":"string",
      "max":64,
      "min":1,
      "pattern":"[\\w+]+",
      "sensitive":true
    },
    "CodeDeliveryDetailsListType":{
      "type":"list",
      "member":{"shape":"CodeDeliveryDetailsType"}
    },
    "CodeDeliveryDetailsType":{
      "type":"structure",
      "members":{
        "Destination":{
          "shape":"StringType",
          "documentation":"<p>The destination for the code delivery details.</p>"
        },
        "DeliveryMedium":{
          "shape":"DeliveryMediumType",
          "documentation":"<p>The delivery medium (email message or phone number).</p>"
        },
        "AttributeName":{
          "shape":"AttributeNameType",
          "documentation":"<p>The name of the attribute in the code delivery details type.</p>"
        }
      },
      "documentation":"<p>The type of code delivery details being returned from the server.</p>"
    },
    "CodeDeliveryFailureException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message sent when a verification code fails to deliver successfully.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when a verification code fails to deliver successfully.</p>",
      "exception":true
    },
    "CodeMismatchException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message provided when the code mismatch exception is thrown.</p>"
        }
      },
      "documentation":"<p>This exception is thrown if the provided code does not match what the server was expecting.</p>",
      "exception":true
    },
    "CompletionMessageType":{
      "type":"string",
      "max":128,
      "min":1,
      "pattern":"[\\w]+"
    },
    "CompromisedCredentialsActionsType":{
      "type":"structure",
      "required":["EventAction"],
      "members":{
        "EventAction":{"shape":"CompromisedCredentialsEventActionType"}
      }
    },
    "CompromisedCredentialsEventActionType":{
      "type":"string",
      "enum":[
        "BLOCK",
        "NO_ACTION"
      ]
    },
    "CompromisedCredentialsRiskConfigurationType":{
      "type":"structure",
      "required":["Actions"],
      "members":{
        "EventFilter":{"shape":"EventFiltersType"},
        "Actions":{"shape":"CompromisedCredentialsActionsType"}
      }
    },
    "ConcurrentModificationException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message provided when the concurrent exception is thrown.</p>"
        }
      },
      "documentation":"<p>This exception is thrown if two or more modifications are happening concurrently.</p>",
      "exception":true
    },
    "ConfirmDeviceRequest":{
      "type":"structure",
      "required":[
        "AccessToken",
        "DeviceKey"
      ],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token.</p>"
        },
        "DeviceKey":{
          "shape":"DeviceKeyType",
          "documentation":"<p>The device key.</p>"
        },
        "DeviceSecretVerifierConfig":{
          "shape":"DeviceSecretVerifierConfigType",
          "documentation":"<p>The configuration of the device secret verifier.</p>"
        },
        "DeviceName":{
          "shape":"DeviceNameType",
          "documentation":"<p>The device name.</p>"
        }
      },
      "documentation":"<p>Confirms the device request.</p>"
    },
    "ConfirmDeviceResponse":{
      "type":"structure",
      "members":{
        "UserConfirmationNecessary":{
          "shape":"BooleanType",
          "documentation":"<p>Indicates whether the user confirmation is necessary to confirm the device response.</p>"
        }
      },
      "documentation":"<p>Confirms the device response.</p>"
    },
    "ConfirmForgotPasswordRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "Username",
        "ConfirmationCode",
        "Password"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "SecretHash":{
          "shape":"SecretHashType",
          "documentation":"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user for whom you want to enter a code to retrieve a forgotten password.</p>"
        },
        "ConfirmationCode":{
          "shape":"ConfirmationCodeType",
          "documentation":"<p>The confirmation code sent by a user's request to retrieve a forgotten password. For more information, see <a href=\"API_ForgotPassword.html\">ForgotPassword</a> </p>"
        },
        "Password":{
          "shape":"PasswordType",
          "documentation":"<p>The password sent by a user's request to retrieve a forgotten password.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"},
        "UserContextData":{"shape":"UserContextDataType"}
      },
      "documentation":"<p>The request representing the confirmation for a password reset.</p>"
    },
    "ConfirmForgotPasswordResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>The response from the server that results from a user's request to retrieve a forgotten password.</p>"
    },
    "ConfirmSignUpRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "Username",
        "ConfirmationCode"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "SecretHash":{
          "shape":"SecretHashType",
          "documentation":"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user whose registration you wish to confirm.</p>"
        },
        "ConfirmationCode":{
          "shape":"ConfirmationCodeType",
          "documentation":"<p>The confirmation code sent by a user's request to confirm registration.</p>"
        },
        "ForceAliasCreation":{
          "shape":"ForceAliasCreation",
          "documentation":"<p>Boolean to be specified to force user confirmation irrespective of existing alias. By default set to False. If this parameter is set to True and the phone number/email used for sign up confirmation already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user being confirmed. If set to False, the API will throw an <b>AliasExistsException</b> error.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"},
        "UserContextData":{"shape":"UserContextDataType"}
      },
      "documentation":"<p>Represents the request to confirm registration of a user.</p>"
    },
    "ConfirmSignUpResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response from the server for the registration confirmation.</p>"
    },
    "ConfirmationCodeType":{
      "type":"string",
      "max":2048,
      "min":1,
      "pattern":"[\\S]+"
    },
    "ContextDataType":{
      "type":"structure",
      "required":[
        "IpAddress",
        "ServerName",
        "ServerPath",
        "HttpHeaders",
        "EncodedData"
      ],
      "members":{
        "IpAddress":{"shape":"StringType"},
        "ServerName":{"shape":"StringType"},
        "ServerPath":{"shape":"StringType"},
        "HttpHeaders":{"shape":"HttpHeaderList"},
        "EncodedData":{"shape":"StringType"}
      }
    },
    "CreateGroupRequest":{
      "type":"structure",
      "required":[
        "GroupName",
        "UserPoolId"
      ],
      "members":{
        "GroupName":{
          "shape":"GroupNameType",
          "documentation":"<p>The name of the group. Must be unique.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        },
        "Description":{
          "shape":"DescriptionType",
          "documentation":"<p>A string containing the description of the group.</p>"
        },
        "RoleArn":{
          "shape":"ArnType",
          "documentation":"<p>The role ARN for the group.</p>"
        },
        "Precedence":{
          "shape":"PrecedenceType",
          "documentation":"<p>A nonnegative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. Zero is the highest precedence value. Groups with lower <code>Precedence</code> values take precedence over groups with higher or null <code>Precedence</code> values. If a user belongs to two or more groups, it is the group with the lowest precedence value whose role ARN will be used in the <code>cognito:roles</code> and <code>cognito:preferred_role</code> claims in the user's tokens.</p> <p>Two groups can have the same <code>Precedence</code> value. If this happens, neither group takes precedence over the other. If two groups with the same <code>Precedence</code> have the same role ARN, that role is used in the <code>cognito:preferred_role</code> claim in tokens for users in each group. If the two groups have different role ARNs, the <code>cognito:preferred_role</code> claim is not set in users' tokens.</p> <p>The default <code>Precedence</code> value is null.</p>"
        }
      }
    },
    "CreateGroupResponse":{
      "type":"structure",
      "members":{
        "Group":{
          "shape":"GroupType",
          "documentation":"<p>The group object for the group.</p>"
        }
      }
    },
    "CreateIdentityProviderRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ProviderName",
        "ProviderType",
        "ProviderDetails"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ProviderName":{"shape":"ProviderNameTypeV1"},
        "ProviderType":{"shape":"IdentityProviderTypeType"},
        "ProviderDetails":{"shape":"ProviderDetailsType"},
        "AttributeMapping":{"shape":"AttributeMappingType"},
        "IdpIdentifiers":{"shape":"IdpIdentifiersListType"}
      }
    },
    "CreateIdentityProviderResponse":{
      "type":"structure",
      "required":["IdentityProvider"],
      "members":{
        "IdentityProvider":{"shape":"IdentityProviderType"}
      }
    },
    "CreateResourceServerRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Identifier",
        "Name"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Identifier":{"shape":"ResourceServerIdentifierType"},
        "Name":{"shape":"ResourceServerNameType"},
        "Scopes":{"shape":"ResourceServerScopeListType"}
      }
    },
    "CreateResourceServerResponse":{
      "type":"structure",
      "required":["ResourceServer"],
      "members":{
        "ResourceServer":{"shape":"ResourceServerType"}
      }
    },
    "CreateUserImportJobRequest":{
      "type":"structure",
      "required":[
        "JobName",
        "UserPoolId",
        "CloudWatchLogsRoleArn"
      ],
      "members":{
        "JobName":{
          "shape":"UserImportJobNameType",
          "documentation":"<p>The job name for the user import job.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool that the users are being imported into.</p>"
        },
        "CloudWatchLogsRoleArn":{
          "shape":"ArnType",
          "documentation":"<p>The role ARN for the Amazon CloudWatch Logging role for the user import job.</p>"
        }
      },
      "documentation":"<p>Represents the request to create the user import job.</p>"
    },
    "CreateUserImportJobResponse":{
      "type":"structure",
      "members":{
        "UserImportJob":{
          "shape":"UserImportJobType",
          "documentation":"<p>The job object that represents the user import job.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to the request to create the user import job.</p>"
    },
    "CreateUserPoolClientRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ClientName"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to create a user pool client.</p>"
        },
        "ClientName":{
          "shape":"ClientNameType",
          "documentation":"<p>The client name for the user pool client you would like to create.</p>"
        },
        "GenerateSecret":{
          "shape":"GenerateSecret",
          "documentation":"<p>Boolean to specify whether you want to generate a secret for the user pool client being created.</p>"
        },
        "RefreshTokenValidity":{
          "shape":"RefreshTokenValidityType",
          "documentation":"<p>The time limit, in days, after which the refresh token is no longer valid and cannot be used.</p>"
        },
        "ReadAttributes":{
          "shape":"ClientPermissionListType",
          "documentation":"<p>The read attributes.</p>"
        },
        "WriteAttributes":{
          "shape":"ClientPermissionListType",
          "documentation":"<p>The write attributes.</p>"
        },
        "ExplicitAuthFlows":{
          "shape":"ExplicitAuthFlowsListType",
          "documentation":"<p>The explicit authentication flows.</p>"
        },
        "SupportedIdentityProviders":{"shape":"SupportedIdentityProvidersListType"},
        "CallbackURLs":{"shape":"CallbackURLsListType"},
        "LogoutURLs":{"shape":"LogoutURLsListType"},
        "DefaultRedirectURI":{"shape":"RedirectUrlType"},
        "AllowedOAuthFlows":{"shape":"OAuthFlowsType"},
        "AllowedOAuthScopes":{"shape":"ScopeListType"},
        "AllowedOAuthFlowsUserPoolClient":{"shape":"BooleanType"},
        "AnalyticsConfiguration":{"shape":"AnalyticsConfigurationType"}
      },
      "documentation":"<p>Represents the request to create a user pool client.</p>"
    },
    "CreateUserPoolClientResponse":{
      "type":"structure",
      "members":{
        "UserPoolClient":{
          "shape":"UserPoolClientType",
          "documentation":"<p>The user pool client that was just created.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to create a user pool client.</p>"
    },
    "CreateUserPoolDomainRequest":{
      "type":"structure",
      "required":[
        "Domain",
        "UserPoolId"
      ],
      "members":{
        "Domain":{"shape":"DomainType"},
        "UserPoolId":{"shape":"UserPoolIdType"}
      }
    },
    "CreateUserPoolDomainResponse":{
      "type":"structure",
      "members":{
      }
    },
    "CreateUserPoolRequest":{
      "type":"structure",
      "required":["PoolName"],
      "members":{
        "PoolName":{
          "shape":"UserPoolNameType",
          "documentation":"<p>A string used to name the user pool.</p>"
        },
        "Policies":{
          "shape":"UserPoolPolicyType",
          "documentation":"<p>The policies associated with the new user pool.</p>"
        },
        "LambdaConfig":{
          "shape":"LambdaConfigType",
          "documentation":"<p>The Lambda trigger configuration information for the new user pool.</p>"
        },
        "AutoVerifiedAttributes":{
          "shape":"VerifiedAttributesListType",
          "documentation":"<p>The attributes to be auto-verified. Possible values: <b>email</b>, <b>phone_number</b>.</p>"
        },
        "AliasAttributes":{
          "shape":"AliasAttributesListType",
          "documentation":"<p>Attributes supported as an alias for this user pool. Possible values: <b>phone_number</b>, <b>email</b>, or <b>preferred_username</b>.</p>"
        },
        "UsernameAttributes":{"shape":"UsernameAttributesListType"},
        "SmsVerificationMessage":{
          "shape":"SmsVerificationMessageType",
          "documentation":"<p>A string representing the SMS verification message.</p>"
        },
        "EmailVerificationMessage":{
          "shape":"EmailVerificationMessageType",
          "documentation":"<p>A string representing the email verification message.</p>"
        },
        "EmailVerificationSubject":{
          "shape":"EmailVerificationSubjectType",
          "documentation":"<p>A string representing the email verification subject.</p>"
        },
        "VerificationMessageTemplate":{"shape":"VerificationMessageTemplateType"},
        "SmsAuthenticationMessage":{
          "shape":"SmsVerificationMessageType",
          "documentation":"<p>A string representing the SMS authentication message.</p>"
        },
        "MfaConfiguration":{
          "shape":"UserPoolMfaType",
          "documentation":"<p>Specifies MFA configuration details.</p>"
        },
        "DeviceConfiguration":{
          "shape":"DeviceConfigurationType",
          "documentation":"<p>The device configuration.</p>"
        },
        "EmailConfiguration":{
          "shape":"EmailConfigurationType",
          "documentation":"<p>The email configuration.</p>"
        },
        "SmsConfiguration":{
          "shape":"SmsConfigurationType",
          "documentation":"<p>The SMS configuration.</p>"
        },
        "UserPoolTags":{
          "shape":"UserPoolTagsType",
          "documentation":"<p>The cost allocation tags for the user pool. For more information, see <a href=\"http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-cost-allocation-tagging.html\">Adding Cost Allocation Tags to Your User Pool</a> </p>"
        },
        "AdminCreateUserConfig":{
          "shape":"AdminCreateUserConfigType",
          "documentation":"<p>The configuration for AdminCreateUser requests.</p>"
        },
        "Schema":{
          "shape":"SchemaAttributesListType",
          "documentation":"<p>An array of schema attributes for the new user pool. These attributes can be standard or custom attributes.</p>"
        },
        "UserPoolAddOns":{"shape":"UserPoolAddOnsType"}
      },
      "documentation":"<p>Represents the request to create a user pool.</p>"
    },
    "CreateUserPoolResponse":{
      "type":"structure",
      "members":{
        "UserPool":{
          "shape":"UserPoolType",
          "documentation":"<p>A container for the user pool details.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server for the request to create a user pool.</p>"
    },
    "CustomAttributeNameType":{
      "type":"string",
      "max":20,
      "min":1,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"
    },
    "CustomAttributesListType":{
      "type":"list",
      "member":{"shape":"SchemaAttributeType"},
      "max":25,
      "min":1
    },
    "DateType":{"type":"timestamp"},
    "DefaultEmailOptionType":{
      "type":"string",
      "enum":[
        "CONFIRM_WITH_LINK",
        "CONFIRM_WITH_CODE"
      ]
    },
    "DeleteGroupRequest":{
      "type":"structure",
      "required":[
        "GroupName",
        "UserPoolId"
      ],
      "members":{
        "GroupName":{
          "shape":"GroupNameType",
          "documentation":"<p>The name of the group.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        }
      }
    },
    "DeleteIdentityProviderRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ProviderName"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ProviderName":{"shape":"ProviderNameType"}
      }
    },
    "DeleteResourceServerRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Identifier"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Identifier":{"shape":"ResourceServerIdentifierType"}
      }
    },
    "DeleteUserAttributesRequest":{
      "type":"structure",
      "required":[
        "UserAttributeNames",
        "AccessToken"
      ],
      "members":{
        "UserAttributeNames":{
          "shape":"AttributeNameListType",
          "documentation":"<p>An array of strings representing the user attribute names you wish to delete.</p>"
        },
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token used in the request to delete user attributes.</p>"
        }
      },
      "documentation":"<p>Represents the request to delete user attributes.</p>"
    },
    "DeleteUserAttributesResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response from the server to delete user attributes.</p>"
    },
    "DeleteUserPoolClientRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ClientId"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to delete the client.</p>"
        },
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        }
      },
      "documentation":"<p>Represents the request to delete a user pool client.</p>"
    },
    "DeleteUserPoolDomainRequest":{
      "type":"structure",
      "required":[
        "Domain",
        "UserPoolId"
      ],
      "members":{
        "Domain":{"shape":"DomainType"},
        "UserPoolId":{"shape":"UserPoolIdType"}
      }
    },
    "DeleteUserPoolDomainResponse":{
      "type":"structure",
      "members":{
      }
    },
    "DeleteUserPoolRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool you want to delete.</p>"
        }
      },
      "documentation":"<p>Represents the request to delete a user pool.</p>"
    },
    "DeleteUserRequest":{
      "type":"structure",
      "required":["AccessToken"],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token from a request to delete a user.</p>"
        }
      },
      "documentation":"<p>Represents the request to delete a user.</p>"
    },
    "DeliveryMediumListType":{
      "type":"list",
      "member":{"shape":"DeliveryMediumType"}
    },
    "DeliveryMediumType":{
      "type":"string",
      "enum":[
        "SMS",
        "EMAIL"
      ]
    },
    "DescribeIdentityProviderRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ProviderName"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ProviderName":{"shape":"ProviderNameType"}
      }
    },
    "DescribeIdentityProviderResponse":{
      "type":"structure",
      "required":["IdentityProvider"],
      "members":{
        "IdentityProvider":{"shape":"IdentityProviderType"}
      }
    },
    "DescribeResourceServerRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Identifier"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Identifier":{"shape":"ResourceServerIdentifierType"}
      }
    },
    "DescribeResourceServerResponse":{
      "type":"structure",
      "required":["ResourceServer"],
      "members":{
        "ResourceServer":{"shape":"ResourceServerType"}
      }
    },
    "DescribeRiskConfigurationRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ClientId":{"shape":"ClientIdType"}
      }
    },
    "DescribeRiskConfigurationResponse":{
      "type":"structure",
      "required":["RiskConfiguration"],
      "members":{
        "RiskConfiguration":{"shape":"RiskConfigurationType"}
      }
    },
    "DescribeUserImportJobRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "JobId"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool that the users are being imported into.</p>"
        },
        "JobId":{
          "shape":"UserImportJobIdType",
          "documentation":"<p>The job ID for the user import job.</p>"
        }
      },
      "documentation":"<p>Represents the request to describe the user import job.</p>"
    },
    "DescribeUserImportJobResponse":{
      "type":"structure",
      "members":{
        "UserImportJob":{
          "shape":"UserImportJobType",
          "documentation":"<p>The job object that represents the user import job.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to the request to describe the user import job.</p>"
    },
    "DescribeUserPoolClientRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ClientId"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool you want to describe.</p>"
        },
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        }
      },
      "documentation":"<p>Represents the request to describe a user pool client.</p>"
    },
    "DescribeUserPoolClientResponse":{
      "type":"structure",
      "members":{
        "UserPoolClient":{
          "shape":"UserPoolClientType",
          "documentation":"<p>The user pool client from a server response to describe the user pool client.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server from a request to describe the user pool client.</p>"
    },
    "DescribeUserPoolDomainRequest":{
      "type":"structure",
      "required":["Domain"],
      "members":{
        "Domain":{"shape":"DomainType"}
      }
    },
    "DescribeUserPoolDomainResponse":{
      "type":"structure",
      "members":{
        "DomainDescription":{"shape":"DomainDescriptionType"}
      }
    },
    "DescribeUserPoolRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool you want to describe.</p>"
        }
      },
      "documentation":"<p>Represents the request to describe the user pool.</p>"
    },
    "DescribeUserPoolResponse":{
      "type":"structure",
      "members":{
        "UserPool":{
          "shape":"UserPoolType",
          "documentation":"<p>The container of metadata returned by the server to describe the pool.</p>"
        }
      },
      "documentation":"<p>Represents the response to describe the user pool.</p>"
    },
    "DescriptionType":{
      "type":"string",
      "max":2048
    },
    "DeviceConfigurationType":{
      "type":"structure",
      "members":{
        "ChallengeRequiredOnNewDevice":{
          "shape":"BooleanType",
          "documentation":"<p>Indicates whether a challenge is required on a new device. Only applicable to a new device.</p>"
        },
        "DeviceOnlyRememberedOnUserPrompt":{
          "shape":"BooleanType",
          "documentation":"<p>If true, a device is only remembered on user prompt.</p>"
        }
      },
      "documentation":"<p>The type of configuration for the user pool's device tracking.</p>"
    },
    "DeviceKeyType":{
      "type":"string",
      "max":55,
      "min":1,
      "pattern":"[\\w-]+_[0-9a-f-]+"
    },
    "DeviceListType":{
      "type":"list",
      "member":{"shape":"DeviceType"}
    },
    "DeviceNameType":{
      "type":"string",
      "max":1024,
      "min":1
    },
    "DeviceRememberedStatusType":{
      "type":"string",
      "enum":[
        "remembered",
        "not_remembered"
      ]
    },
    "DeviceSecretVerifierConfigType":{
      "type":"structure",
      "members":{
        "PasswordVerifier":{
          "shape":"StringType",
          "documentation":"<p>The password verifier.</p>"
        },
        "Salt":{
          "shape":"StringType",
          "documentation":"<p>The salt.</p>"
        }
      },
      "documentation":"<p>The device verifier against which it will be authenticated.</p>"
    },
    "DeviceType":{
      "type":"structure",
      "members":{
        "DeviceKey":{
          "shape":"DeviceKeyType",
          "documentation":"<p>The device key.</p>"
        },
        "DeviceAttributes":{
          "shape":"AttributeListType",
          "documentation":"<p>The device attributes.</p>"
        },
        "DeviceCreateDate":{
          "shape":"DateType",
          "documentation":"<p>The creation date of the device.</p>"
        },
        "DeviceLastModifiedDate":{
          "shape":"DateType",
          "documentation":"<p>The last modified date of the device.</p>"
        },
        "DeviceLastAuthenticatedDate":{
          "shape":"DateType",
          "documentation":"<p>The date in which the device was last authenticated.</p>"
        }
      },
      "documentation":"<p>The device type.</p>"
    },
    "DomainDescriptionType":{
      "type":"structure",
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "AWSAccountId":{"shape":"AWSAccountIdType"},
        "Domain":{"shape":"DomainType"},
        "S3Bucket":{"shape":"S3BucketType"},
        "CloudFrontDistribution":{"shape":"ArnType"},
        "Version":{"shape":"DomainVersionType"},
        "Status":{"shape":"DomainStatusType"}
      }
    },
    "DomainStatusType":{
      "type":"string",
      "enum":[
        "CREATING",
        "DELETING",
        "UPDATING",
        "ACTIVE",
        "FAILED"
      ]
    },
    "DomainType":{
      "type":"string",
      "max":63,
      "min":1,
      "pattern":"^[a-z0-9](?:[a-z0-9\\-]{0,61}[a-z0-9])?$"
    },
    "DomainVersionType":{
      "type":"string",
      "max":20,
      "min":1
    },
    "DuplicateProviderException":{
      "type":"structure",
      "members":{
        "message":{"shape":"MessageType"}
      },
      "exception":true
    },
    "EmailAddressType":{
      "type":"string",
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+@[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"
    },
    "EmailConfigurationType":{
      "type":"structure",
      "members":{
        "SourceArn":{
          "shape":"ArnType",
          "documentation":"<p>The Amazon Resource Name (ARN) of the email source.</p>"
        },
        "ReplyToEmailAddress":{
          "shape":"EmailAddressType",
          "documentation":"<p>The REPLY-TO email address.</p>"
        }
      },
      "documentation":"<p>The email configuration type.</p>"
    },
    "EmailNotificationBodyType":{
      "type":"string",
      "max":20000,
      "min":6,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]+"
    },
    "EmailNotificationSubjectType":{
      "type":"string",
      "max":140,
      "min":1,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s]+"
    },
    "EmailVerificationMessageByLinkType":{
      "type":"string",
      "max":20000,
      "min":6,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*\\{##[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*##\\}[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*"
    },
    "EmailVerificationMessageType":{
      "type":"string",
      "max":20000,
      "min":6,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*\\{####\\}[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*"
    },
    "EmailVerificationSubjectByLinkType":{
      "type":"string",
      "max":140,
      "min":1,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s]+"
    },
    "EmailVerificationSubjectType":{
      "type":"string",
      "max":140,
      "min":1,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s]+"
    },
    "EnableSoftwareTokenMFAException":{
      "type":"structure",
      "members":{
        "message":{"shape":"MessageType"}
      },
      "exception":true
    },
    "EnhanceAuthRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "Username",
        "AuthState",
        "Code"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "SecretHash":{
          "shape":"SecretHashType",
          "documentation":"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user for whom you wish to enhance authentication.</p>"
        },
        "AuthState":{
          "shape":"AuthStateType",
          "documentation":"<p>The authentication state.</p>"
        },
        "Code":{
          "shape":"StringType",
          "documentation":"<p>The code returned from the enhanced authentication request.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"}
      },
      "documentation":"<p>Represents the request by the developer to enhance the authentication on a user pool.</p>"
    },
    "EnhanceAuthResponse":{
      "type":"structure",
      "members":{
        "AuthenticationResult":{
          "shape":"AuthenticationResultType",
          "documentation":"<p>The authentication result from the enhanced authentication response.</p>"
        }
      },
      "documentation":"<p>Represents the response from the enhanced authentication request.</p>"
    },
    "EventContextDataType":{
      "type":"structure",
      "members":{
        "IpAddress":{"shape":"StringType"},
        "DeviceName":{"shape":"StringType"},
        "Timezone":{"shape":"StringType"},
        "City":{"shape":"StringType"},
        "Country":{"shape":"StringType"}
      }
    },
    "EventFeedbackType":{
      "type":"structure",
      "required":[
        "FeedbackValue",
        "Provider"
      ],
      "members":{
        "FeedbackValue":{"shape":"FeedbackValueType"},
        "Provider":{"shape":"StringType"},
        "FeedbackDate":{"shape":"DateType"}
      }
    },
    "EventFilterType":{
      "type":"string",
      "enum":[
        "SIGN_IN",
        "FORGOT_PASSWORD",
        "ALL"
      ]
    },
    "EventFiltersType":{
      "type":"list",
      "member":{"shape":"EventFilterType"}
    },
    "EventIdType":{
      "type":"string",
      "max":50,
      "min":1,
      "pattern":"[\\w+-]+"
    },
    "EventResponseType":{
      "type":"string",
      "enum":[
        "Success",
        "Failure"
      ]
    },
    "EventRiskType":{
      "type":"structure",
      "members":{
        "RiskDecision":{"shape":"RiskDecisionType"},
        "RiskLevel":{"shape":"RiskLevelType"}
      }
    },
    "EventType":{
      "type":"string",
      "enum":[
        "SignIn",
        "SignUp",
        "ForgotPassword"
      ]
    },
    "ExpiredCodeException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the expired code exception is thrown.</p>"
        }
      },
      "documentation":"<p>This exception is thrown if a code has expired.</p>",
      "exception":true
    },
    "ExplicitAuthFlowsListType":{
      "type":"list",
      "member":{"shape":"ExplicitAuthFlowsType"}
    },
    "ExplicitAuthFlowsType":{
      "type":"string",
      "enum":[
        "ADMIN_NO_SRP_AUTH",
        "CUSTOM_AUTH_FLOW_ONLY"
      ]
    },
    "FeedbackValueType":{
      "type":"string",
      "enum":[
        "Bad",
        "Good"
      ]
    },
    "ForceAliasCreation":{"type":"boolean"},
    "ForgetDeviceRequest":{
      "type":"structure",
      "required":["DeviceKey"],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token for the forgotten device request.</p>"
        },
        "DeviceKey":{
          "shape":"DeviceKeyType",
          "documentation":"<p>The device key.</p>"
        }
      },
      "documentation":"<p>Represents the request to forget the device.</p>"
    },
    "ForgotPasswordRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "Username"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "SecretHash":{
          "shape":"SecretHashType",
          "documentation":"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"
        },
        "UserContextData":{"shape":"UserContextDataType"},
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user for whom you want to enter a code to reset a forgotten password.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"}
      },
      "documentation":"<p>Represents the request to reset a user's password.</p>"
    },
    "ForgotPasswordResponse":{
      "type":"structure",
      "members":{
        "CodeDeliveryDetails":{
          "shape":"CodeDeliveryDetailsType",
          "documentation":"<p>The code delivery details returned by the server in response to the request to reset a password.</p>"
        }
      },
      "documentation":"<p>Respresents the response from the server regarding the request to reset a password.</p>"
    },
    "GenerateSecret":{"type":"boolean"},
    "GetAuthenticationDetailsRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "Username",
        "SrpA"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "SecretHash":{
          "shape":"SecretHashType",
          "documentation":"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user for whom you wish to retrieve authentication details.</p>"
        },
        "SrpA":{
          "shape":"AValueHexStringType",
          "documentation":"<p>The Secure Remote Password protocol (SRP) key. For more information, see <a href=\"https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol\">Secure Remote Password Protocol</a>.</p>"
        },
        "ValidationData":{
          "shape":"AttributeListType",
          "documentation":"<p>The validation data of the request to get authentication details.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"}
      },
      "documentation":"<p>Represents the user's request to get authentication details.</p>"
    },
    "GetAuthenticationDetailsResponse":{
      "type":"structure",
      "required":[
        "Salt",
        "SrpB",
        "SecretBlock"
      ],
      "members":{
        "Salt":{
          "shape":"HexStringType",
          "documentation":"<p>A salt that gets returned by the response from the server to get authentication details. For more information, see <a href=\"https://en.wikipedia.org/wiki/Salt_%28cryptography%29\">Salt cryptography</a>.</p>"
        },
        "SrpB":{
          "shape":"HexStringType",
          "documentation":"<p>The Secure Remote Password protocol (SRP) key. For more information, see <a href=\"https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol\">Secure Remote Password Protocol</a>.</p>"
        },
        "SecretBlock":{
          "shape":"BlobType",
          "documentation":"<p>A blob that blocks the secret hash in the get authentication details response.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The resolved username for a possible alias in the input username parameter.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to get authentication details.</p>"
    },
    "GetCSVHeaderRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool that the users are to be imported into.</p>"
        }
      },
      "documentation":"<p>Represents the request to get the header information for the .csv file for the user import job.</p>"
    },
    "GetCSVHeaderResponse":{
      "type":"structure",
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool that the users are to be imported into.</p>"
        },
        "CSVHeader":{
          "shape":"ListOfStringTypes",
          "documentation":"<p>The header information for the .csv file for the user import job.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to the request to get the header information for the .csv file for the user import job.</p>"
    },
    "GetDeviceRequest":{
      "type":"structure",
      "required":["DeviceKey"],
      "members":{
        "DeviceKey":{
          "shape":"DeviceKeyType",
          "documentation":"<p>The device key.</p>"
        },
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token.</p>"
        }
      },
      "documentation":"<p>Represents the request to get the device.</p>"
    },
    "GetDeviceResponse":{
      "type":"structure",
      "required":["Device"],
      "members":{
        "Device":{
          "shape":"DeviceType",
          "documentation":"<p>The device.</p>"
        }
      },
      "documentation":"<p>Gets the device response.</p>"
    },
    "GetGroupRequest":{
      "type":"structure",
      "required":[
        "GroupName",
        "UserPoolId"
      ],
      "members":{
        "GroupName":{
          "shape":"GroupNameType",
          "documentation":"<p>The name of the group.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        }
      }
    },
    "GetGroupResponse":{
      "type":"structure",
      "members":{
        "Group":{
          "shape":"GroupType",
          "documentation":"<p>The group object for the group.</p>"
        }
      }
    },
    "GetIdentityProviderByIdentifierRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "IdpIdentifier"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "IdpIdentifier":{"shape":"IdpIdentifierType"}
      }
    },
    "GetIdentityProviderByIdentifierResponse":{
      "type":"structure",
      "required":["IdentityProvider"],
      "members":{
        "IdentityProvider":{"shape":"IdentityProviderType"}
      }
    },
    "GetJWKSRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to get JSON Web keys.</p>"
        }
      },
      "documentation":"<p>Represents the request to get JSON Web keys.</p>"
    },
    "GetJWKSResponse":{
      "type":"structure",
      "members":{
        "keys":{
          "shape":"KeyListType",
          "documentation":"<p>The keys in a get JSON Web keys response.</p>"
        },
        "cacheControl":{
          "shape":"StringType",
          "documentation":"<p>The value of the <code>Cache-Control</code> HTTP header field for the JSON Web keys response. For more information on <code>cacheControl</code>, see <a href=\"https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9\">https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9</a>.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to get JSON Web keys.</p>"
    },
    "GetOpenIdConfigurationRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to get Open ID configuration information.</p>"
        }
      },
      "documentation":"<p>Represents the request to get the Open ID configuration.</p>"
    },
    "GetOpenIdConfigurationResponse":{
      "type":"structure",
      "members":{
        "issuer":{
          "shape":"openIdUrlType",
          "documentation":"<p>The issuer of the Open ID configuration response.</p>"
        },
        "jwks_uri":{
          "shape":"openIdUrlType",
          "documentation":"<p>The URI of the JSON Web keys in the server response to get Open ID configuration information.</p>"
        },
        "authorization_endpoint":{
          "shape":"openIdUrlType",
          "documentation":"<p>The authorization endpoint returned by the server response to get the Open ID configuration information.</p>"
        },
        "subject_types_supported":{
          "shape":"openIdListType",
          "documentation":"<p>The subject types supported returned by the server response to get the Open ID configuration information.</p>"
        },
        "response_types_supported":{
          "shape":"openIdListType",
          "documentation":"<p>The response types supported returned by the server response to get the Open ID configuration information.</p>"
        },
        "id_token_signing_alg_values_supported":{
          "shape":"openIdListType",
          "documentation":"<p>The token-signing algorithm values supported returned by the server response to get the Open ID configuration information.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to get the Open ID configuration information.</p>"
    },
    "GetSigningCertificateRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"}
      }
    },
    "GetSigningCertificateResponse":{
      "type":"structure",
      "members":{
        "Certificate":{"shape":"StringType"}
      }
    },
    "GetUICustomizationRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ClientId":{"shape":"ClientIdType"}
      }
    },
    "GetUICustomizationResponse":{
      "type":"structure",
      "required":["UICustomization"],
      "members":{
        "UICustomization":{"shape":"UICustomizationType"}
      }
    },
    "GetUserAttributeVerificationCodeRequest":{
      "type":"structure",
      "required":[
        "AccessToken",
        "AttributeName"
      ],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token returned by the server response to get the user attribute verification code.</p>"
        },
        "AttributeName":{
          "shape":"AttributeNameType",
          "documentation":"<p>The attribute name returned by the server response to get the user attribute verification code.</p>"
        }
      },
      "documentation":"<p>Represents the request to get user attribute verification.</p>"
    },
    "GetUserAttributeVerificationCodeResponse":{
      "type":"structure",
      "members":{
        "CodeDeliveryDetails":{
          "shape":"CodeDeliveryDetailsType",
          "documentation":"<p>The code delivery details returned by the server in response to the request to get the user attribute verification code.</p>"
        }
      },
      "documentation":"<p>The verification code response returned by the server response to get the user attribute verification code.</p>"
    },
    "GetUserPoolMfaConfigRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"}
      }
    },
    "GetUserPoolMfaConfigResponse":{
      "type":"structure",
      "members":{
        "SmsMfaConfiguration":{"shape":"SmsMfaConfigType"},
        "SoftwareTokenMfaConfiguration":{"shape":"SoftwareTokenMfaConfigType"},
        "MfaConfiguration":{"shape":"UserPoolMfaType"}
      }
    },
    "GetUserPoolUIConfigurationRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"}
      }
    },
    "GetUserPoolUIConfigurationResponse":{
      "type":"structure",
      "required":["UserPoolUIConfiguration"],
      "members":{
        "UserPoolUIConfiguration":{"shape":"UserPoolUIConfigurationType"}
      }
    },
    "GetUserRequest":{
      "type":"structure",
      "required":["AccessToken"],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token returned by the server response to get information about the user.</p>"
        }
      },
      "documentation":"<p>Represents the request to get information about the user.</p>"
    },
    "GetUserResponse":{
      "type":"structure",
      "required":[
        "Username",
        "UserAttributes"
      ],
      "members":{
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user you wish to retrieve from the get user request.</p>"
        },
        "UserAttributes":{
          "shape":"AttributeListType",
          "documentation":"<p>An array of name-value pairs representing user attributes.</p>"
        },
        "MFAOptions":{
          "shape":"MFAOptionListType",
          "documentation":"<p>Specifies the options for MFA (e.g., email or phone number).</p>"
        }
      },
      "documentation":"<p>Represents the response from the server from the request to get information about the user.</p>"
    },
    "GlobalSignOutRequest":{
      "type":"structure",
      "required":["AccessToken"],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token.</p>"
        }
      },
      "documentation":"<p>Represents the request to sign out all devices.</p>"
    },
    "GlobalSignOutResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>The response to the request to sign out all devices.</p>"
    },
    "GroupExistsException":{
      "type":"structure",
      "members":{
        "message":{"shape":"MessageType"}
      },
      "documentation":"<p>This exception is thrown when Amazon Cognito encounters a group that already exists in the user pool.</p>",
      "exception":true
    },
    "GroupListType":{
      "type":"list",
      "member":{"shape":"GroupType"}
    },
    "GroupNameType":{
      "type":"string",
      "max":128,
      "min":1,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"
    },
    "GroupType":{
      "type":"structure",
      "members":{
        "GroupName":{
          "shape":"GroupNameType",
          "documentation":"<p>The name of the group.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        },
        "Description":{
          "shape":"DescriptionType",
          "documentation":"<p>A string containing the description of the group.</p>"
        },
        "RoleArn":{
          "shape":"ArnType",
          "documentation":"<p>The role ARN for the group.</p>"
        },
        "Precedence":{
          "shape":"PrecedenceType",
          "documentation":"<p>A nonnegative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. If a user belongs to two or more groups, it is the group with the highest precedence whose role ARN will be used in the <code>cognito:roles</code> and <code>cognito:preferred_role</code> claims in the user's tokens. Groups with higher <code>Precedence</code> values take precedence over groups with lower <code>Precedence</code> values or with null <code>Precedence</code> values.</p> <p>Two groups can have the same <code>Precedence</code> value. If this happens, neither group takes precedence over the other. If two groups with the same <code>Precedence</code> have the same role ARN, that role is used in the <code>cognito:preferred_role</code> claim in tokens for users in each group. If the two groups have different role ARNs, the <code>cognito:preferred_role</code> claim is not set in users' tokens.</p> <p>The default <code>Precedence</code> value is null.</p>"
        },
        "LastModifiedDate":{
          "shape":"DateType",
          "documentation":"<p>The date the group was last modified.</p>"
        },
        "CreationDate":{
          "shape":"DateType",
          "documentation":"<p>The date the group was created.</p>"
        }
      },
      "documentation":"<p>The group type.</p>"
    },
    "HexStringType":{
      "type":"string",
      "pattern":"^[0-9a-fA-F]+$"
    },
    "HttpHeader":{
      "type":"structure",
      "members":{
        "headerName":{"shape":"StringType"},
        "headerValue":{"shape":"StringType"}
      }
    },
    "HttpHeaderList":{
      "type":"list",
      "member":{"shape":"HttpHeader"}
    },
    "IdentityProviderType":{
      "type":"structure",
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ProviderName":{"shape":"ProviderNameType"},
        "ProviderType":{"shape":"IdentityProviderTypeType"},
        "ProviderDetails":{"shape":"ProviderDetailsType"},
        "AttributeMapping":{"shape":"AttributeMappingType"},
        "IdpIdentifiers":{"shape":"IdpIdentifiersListType"},
        "LastModifiedDate":{"shape":"DateType"},
        "CreationDate":{"shape":"DateType"}
      }
    },
    "IdentityProviderTypeType":{
      "type":"string",
      "enum":[
        "SAML",
        "Facebook",
        "Google",
        "LoginWithAmazon",
        "ActiveDirectory"
      ]
    },
    "IdpIdentifierType":{
      "type":"string",
      "max":40,
      "min":1,
      "pattern":"[\\w\\s+=.@-]+"
    },
    "IdpIdentifiersListType":{
      "type":"list",
      "member":{"shape":"IdpIdentifierType"},
      "max":50,
      "min":0
    },
    "ImageFileType":{"type":"blob"},
    "ImageUrlType":{"type":"string"},
    "InitiateAuthRequest":{
      "type":"structure",
      "required":[
        "AuthFlow",
        "ClientId"
      ],
      "members":{
        "AuthFlow":{
          "shape":"AuthFlowType",
          "documentation":"<p>The authentication flow for this call to execute. The API action will depend on this value. For example: </p> <ul> <li> <p> <code>REFRESH_TOKEN_AUTH</code> will take in a valid refresh token and return new tokens.</p> </li> <li> <p> <code>USER_SRP_AUTH</code> will take in USERNAME and SRPA and return the SRP variables to be used for next challenge execution.</p> </li> </ul> <p>Valid values include:</p> <ul> <li> <p> <code>USER_SRP_AUTH</code>: Authentication flow for the Secure Remote Password (SRP) protocol.</p> </li> <li> <p> <code>REFRESH_TOKEN_AUTH</code>/<code>REFRESH_TOKEN</code>: Authentication flow for refreshing the access token and ID token by supplying a valid refresh token.</p> </li> <li> <p> <code>CUSTOM_AUTH</code>: Custom authentication flow.</p> </li> </ul> <p> <code>ADMIN_NO_SRP_AUTH</code> is not a valid value.</p>"
        },
        "AuthParameters":{
          "shape":"AuthParametersType",
          "documentation":"<p>The authentication parameters. These are inputs corresponding to the <code>AuthFlow</code> that you are invoking. The required values depend on the value of <code>AuthFlow</code>:</p> <ul> <li> <p>For <code>USER_SRP_AUTH</code>: <code>USERNAME</code> (required), <code>SRPA</code> (required), <code>SECRET_HASH</code> (required if the app client is configured with a client secret), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>REFRESH_TOKEN_AUTH/REFRESH_TOKEN</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (required if the app client is configured with a client secret), <code>REFRESH_TOKEN</code> (required), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>CUSTOM_AUTH</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (if app client is configured with client secret), <code>DEVICE_KEY</code> </p> </li> </ul>"
        },
        "ClientMetadata":{
          "shape":"ClientMetadataType",
          "documentation":"<p>This is a random key-value pair map which can contain any key and will be passed to your PreAuthentication Lambda trigger as-is. It can be used to implement additional validations around authentication.</p>"
        },
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The app client ID.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"},
        "UserContextData":{"shape":"UserContextDataType"}
      },
      "documentation":"<p>Initiates the authentication request.</p>"
    },
    "InitiateAuthResponse":{
      "type":"structure",
      "members":{
        "ChallengeName":{
          "shape":"ChallengeNameType",
          "documentation":"<p>The name of the challenge which you are responding to with this call. This is returned to you in the <code>AdminInitiateAuth</code> response if you need to pass another challenge.</p> <p>Valid values include the following. Note that all of these challenges require <code>USERNAME</code> and <code>SECRET_HASH</code> (if applicable) in the parameters.</p> <ul> <li> <p> <code>SMS_MFA</code>: Next challenge is to supply an <code>SMS_MFA_CODE</code>, delivered via SMS.</p> </li> <li> <p> <code>PASSWORD_VERIFIER</code>: Next challenge is to supply <code>PASSWORD_CLAIM_SIGNATURE</code>, <code>PASSWORD_CLAIM_SECRET_BLOCK</code>, and <code>TIMESTAMP</code> after the client-side SRP calculations.</p> </li> <li> <p> <code>CUSTOM_CHALLENGE</code>: This is returned if your custom authentication flow determines that the user should pass another challenge before tokens are issued.</p> </li> <li> <p> <code>DEVICE_SRP_AUTH</code>: If device tracking was enabled on your user pool and the previous challenges were passed, this challenge is returned so that Amazon Cognito can start tracking this device.</p> </li> <li> <p> <code>DEVICE_PASSWORD_VERIFIER</code>: Similar to <code>PASSWORD_VERIFIER</code>, but for devices only.</p> </li> <li> <p> <code>NEW_PASSWORD_REQUIRED</code>: For users which are required to change their passwords after successful first login. This challenge should be passed with <code>NEW_PASSWORD</code> and any other required attributes.</p> </li> </ul>"
        },
        "Session":{
          "shape":"SessionType",
          "documentation":"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"
        },
        "ChallengeParameters":{
          "shape":"ChallengeParametersType",
          "documentation":"<p>The challenge parameters. These are returned to you in the <code>InitiateAuth</code> response if you need to pass another challenge. The responses in this parameter should be used to compute inputs to the next call (<code>RespondToAuthChallenge</code>). </p> <p>All challenges require <code>USERNAME</code> and <code>SECRET_HASH</code> (if applicable).</p>"
        },
        "AuthenticationResult":{
          "shape":"AuthenticationResultType",
          "documentation":"<p>The result of the authentication response. This is only returned if the caller does not need to pass another challenge. If the caller does need to pass another challenge before it gets tokens, <code>ChallengeName</code>, <code>ChallengeParameters</code>, and <code>Session</code> are returned.</p>"
        }
      },
      "documentation":"<p>Initiates the authentication response.</p>"
    },
    "IntegerType":{"type":"integer"},
    "InternalErrorException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when Amazon Cognito throws an internal error exception.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when Amazon Cognito encounters an internal error.</p>",
      "exception":true,
      "fault":true
    },
    "InvalidEmailRoleAccessPolicyException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when you have an unverified email address or the identity policy is not set on an email address that Amazon Cognito can access.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when Amazon Cognito is not allowed to use your email identity. HTTP status code: 400.</p>",
      "exception":true
    },
    "InvalidLambdaResponseException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the Amazon Cognito service throws an invalid AWS Lambda response exception.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when the Amazon Cognito service encounters an invalid AWS Lambda response.</p>",
      "exception":true
    },
    "InvalidOAuthFlowException":{
      "type":"structure",
      "members":{
        "message":{"shape":"MessageType"}
      },
      "exception":true
    },
    "InvalidParameterException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the Amazon Cognito service throws an invalid parameter exception.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when the Amazon Cognito service encounters an invalid parameter.</p>",
      "exception":true
    },
    "InvalidPasswordException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the Amazon Cognito service throws an invalid user password exception.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when the Amazon Cognito service encounters an invalid password.</p>",
      "exception":true
    },
    "InvalidSmsRoleAccessPolicyException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message retuned when the invalid SMS role access policy exception is thrown.</p>"
        }
      },
      "documentation":"<p>This exception is returned when the role provided for SMS configuration does not have permission to publish using Amazon SNS.</p>",
      "exception":true
    },
    "InvalidSmsRoleTrustRelationshipException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the role trust relationship for the SMS message is invalid.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when the trust relationship is invalid for the role provided for SMS configuration. This can happen if you do not trust <b>cognito-idp.amazonaws.com</b> or the external ID provided in the role does not match what is provided in the SMS configuration for the user pool.</p>",
      "exception":true
    },
    "InvalidUserPoolConfigurationException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the user pool configuration is invalid.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when the user pool configuration is invalid.</p>",
      "exception":true
    },
    "KeyListType":{
      "type":"list",
      "member":{"shape":"KeyType"}
    },
    "KeyType":{
      "type":"structure",
      "members":{
        "kty":{
          "shape":"StringType",
          "documentation":"<p>A \"kty\" key type parameter. For more information, see <a href=\"http://self-issued.info/docs/draft-ietf-jose-json-web-key.html\">JSON Web Key (JWK) Format</a>.</p>"
        },
        "alg":{
          "shape":"StringType",
          "documentation":"<p>A \"kty\" (Key Type) parameter. For more information, see <a href=\"http://self-issued.info/docs/draft-ietf-jose-json-web-key.html#ktyDef\">\"kty\" (Key Type) Parameter</a>.</p>"
        },
        "use":{
          "shape":"StringType",
          "documentation":"<p>A \"use\" (Public Key Use) parameter. For more information, see <a href=\"http://self-issued.info/docs/draft-ietf-jose-json-web-key.html#useDef\">\"use\" (Public Key Use) Parameter</a>.</p>"
        },
        "kid":{
          "shape":"StringType",
          "documentation":"<p>A \"kid\" (Key ID) parameter. For more information, see <a href=\"http://self-issued.info/docs/draft-ietf-jose-json-web-key.html#kidDef\">\"kid\" (Key ID) Parameter</a>.</p>"
        },
        "n":{
          "shape":"StringType",
          "documentation":"<p>An \"n\" parameter.</p>"
        },
        "e":{
          "shape":"StringType",
          "documentation":"<p>An \"e\" parameter.</p>"
        }
      },
      "documentation":"<p>A JSON Web Key key type in <a href=\"http://self-issued.info/docs/draft-ietf-jose-json-web-key.html#rfc.section.4\">JSON Web Key (JWK) Format</a>.</p>"
    },
    "LambdaConfigType":{
      "type":"structure",
      "members":{
        "PreSignUp":{
          "shape":"ArnType",
          "documentation":"<p>A pre-registration AWS Lambda trigger.</p>"
        },
        "CustomMessage":{
          "shape":"ArnType",
          "documentation":"<p>A custom Message AWS Lambda trigger.</p>"
        },
        "PostConfirmation":{
          "shape":"ArnType",
          "documentation":"<p>A post-confirmation AWS Lambda trigger.</p>"
        },
        "PreAuthentication":{
          "shape":"ArnType",
          "documentation":"<p>A pre-authentication AWS Lambda trigger.</p>"
        },
        "PostAuthentication":{
          "shape":"ArnType",
          "documentation":"<p>A post-authentication AWS Lambda trigger.</p>"
        },
        "DefineAuthChallenge":{
          "shape":"ArnType",
          "documentation":"<p>Defines the authentication challenge.</p>"
        },
        "CreateAuthChallenge":{
          "shape":"ArnType",
          "documentation":"<p>Creates an authentication challenge.</p>"
        },
        "VerifyAuthChallengeResponse":{
          "shape":"ArnType",
          "documentation":"<p>Verifies the authentication challenge response.</p>"
        },
        "PreTokenGeneration":{"shape":"ArnType"}
      },
      "documentation":"<p>Specifies the type of configuration for AWS Lambda triggers.</p>"
    },
    "LimitExceededException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when Amazon Cognito throws a limit exceeded exception.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when a user exceeds the limit for a requested AWS resource.</p>",
      "exception":true
    },
    "ListDevicesRequest":{
      "type":"structure",
      "required":["AccessToken"],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access tokens for the request to list devices.</p>"
        },
        "Limit":{
          "shape":"QueryLimitType",
          "documentation":"<p>The limit of the device request.</p>"
        },
        "PaginationToken":{
          "shape":"SearchPaginationTokenType",
          "documentation":"<p>The pagination token for the list request.</p>"
        }
      },
      "documentation":"<p>Represents the request to list the devices.</p>"
    },
    "ListDevicesResponse":{
      "type":"structure",
      "members":{
        "Devices":{
          "shape":"DeviceListType",
          "documentation":"<p>The devices returned in the list devices response.</p>"
        },
        "PaginationToken":{
          "shape":"SearchPaginationTokenType",
          "documentation":"<p>The pagination token for the list device response.</p>"
        }
      },
      "documentation":"<p>Represents the response to list devices.</p>"
    },
    "ListGroupsRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        },
        "Limit":{
          "shape":"QueryLimitType",
          "documentation":"<p>The limit of the request to list groups.</p>"
        },
        "NextToken":{
          "shape":"PaginationKey",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      }
    },
    "ListGroupsResponse":{
      "type":"structure",
      "members":{
        "Groups":{
          "shape":"GroupListType",
          "documentation":"<p>The group objects for the groups.</p>"
        },
        "NextToken":{
          "shape":"PaginationKey",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      }
    },
    "ListIdentityProvidersRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "MaxResults":{"shape":"ListProvidersLimitType"},
        "NextToken":{"shape":"PaginationKeyType"}
      }
    },
    "ListIdentityProvidersResponse":{
      "type":"structure",
      "required":["Providers"],
      "members":{
        "Providers":{"shape":"ProvidersListType"},
        "NextToken":{"shape":"PaginationKeyType"}
      }
    },
    "ListOfStringTypes":{
      "type":"list",
      "member":{"shape":"StringType"}
    },
    "ListProvidersLimitType":{
      "type":"integer",
      "max":60,
      "min":1
    },
    "ListResourceServersLimitType":{
      "type":"integer",
      "max":50,
      "min":1
    },
    "ListResourceServersRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "MaxResults":{"shape":"ListResourceServersLimitType"},
        "NextToken":{"shape":"PaginationKeyType"}
      }
    },
    "ListResourceServersResponse":{
      "type":"structure",
      "required":["ResourceServers"],
      "members":{
        "ResourceServers":{"shape":"ResourceServersListType"},
        "NextToken":{"shape":"PaginationKeyType"}
      }
    },
    "ListUserImportJobsRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "MaxResults"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool that the users are being imported into.</p>"
        },
        "MaxResults":{
          "shape":"PoolQueryLimitType",
          "documentation":"<p>The maximum number of import jobs you want the request to return.</p>"
        },
        "PaginationToken":{
          "shape":"PaginationKeyType",
          "documentation":"<p>An identifier that was returned from the previous call to ListUserImportJobs, which can be used to return the next set of import jobs in the list.</p>"
        }
      },
      "documentation":"<p>Represents the request to list the user import jobs.</p>"
    },
    "ListUserImportJobsResponse":{
      "type":"structure",
      "members":{
        "UserImportJobs":{
          "shape":"UserImportJobsListType",
          "documentation":"<p>The user import jobs.</p>"
        },
        "PaginationToken":{
          "shape":"PaginationKeyType",
          "documentation":"<p>An identifier that can be used to return the next set of user import jobs in the list.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to the request to list the user import jobs.</p>"
    },
    "ListUserPoolClientsRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to list user pool clients.</p>"
        },
        "MaxResults":{
          "shape":"QueryLimit",
          "documentation":"<p>The maximum number of results you want the request to return when listing the user pool clients.</p>"
        },
        "NextToken":{
          "shape":"PaginationKey",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      },
      "documentation":"<p>Represents the request to list the user pool clients.</p>"
    },
    "ListUserPoolClientsResponse":{
      "type":"structure",
      "members":{
        "UserPoolClients":{
          "shape":"UserPoolClientListType",
          "documentation":"<p>The user pool clients in the response that lists user pool clients.</p>"
        },
        "NextToken":{
          "shape":"PaginationKey",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server that lists user pool clients.</p>"
    },
    "ListUserPoolsRequest":{
      "type":"structure",
      "required":["MaxResults"],
      "members":{
        "NextToken":{
          "shape":"PaginationKeyType",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        },
        "MaxResults":{
          "shape":"PoolQueryLimitType",
          "documentation":"<p>The maximum number of results you want the request to return when listing the user pools.</p>"
        }
      },
      "documentation":"<p>Represents the request to list user pools.</p>"
    },
    "ListUserPoolsResponse":{
      "type":"structure",
      "members":{
        "UserPools":{
          "shape":"UserPoolListType",
          "documentation":"<p>The user pools from the response to list users.</p>"
        },
        "NextToken":{
          "shape":"PaginationKeyType",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      },
      "documentation":"<p>Represents the response to list user pools.</p>"
    },
    "ListUsersInGroupRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "GroupName"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        },
        "GroupName":{
          "shape":"GroupNameType",
          "documentation":"<p>The name of the group.</p>"
        },
        "Limit":{
          "shape":"QueryLimitType",
          "documentation":"<p>The limit of the request to list users.</p>"
        },
        "NextToken":{
          "shape":"PaginationKey",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      }
    },
    "ListUsersInGroupResponse":{
      "type":"structure",
      "members":{
        "Users":{
          "shape":"UsersListType",
          "documentation":"<p>The users returned in the request to list users.</p>"
        },
        "NextToken":{
          "shape":"PaginationKey",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      }
    },
    "ListUsersRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool on which the search should be performed.</p>"
        },
        "AttributesToGet":{
          "shape":"SearchedAttributeNamesListType",
          "documentation":"<p>An array of strings, where each string is the name of a user attribute to be returned for each user in the search results. If the array is empty, all attributes are returned.</p>"
        },
        "Limit":{
          "shape":"QueryLimitType",
          "documentation":"<p>Maximum number of users to be returned.</p>"
        },
        "PaginationToken":{
          "shape":"SearchPaginationTokenType",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        },
        "Filter":{
          "shape":"UserFilterType",
          "documentation":"<p>A filter string of the form \"<i>AttributeName</i> <i>Filter-Type</i> \"<i>AttributeValue</i>\"\". Quotation marks within the filter string must be escaped using the backslash (\\) character. For example, \"<code>family_name</code> = \\\"Reddy\\\"\".</p> <ul> <li> <p> <i>AttributeName</i>: The name of the attribute to search for. You can only search for one attribute at a time.</p> </li> <li> <p> <i>Filter-Type</i>: For an exact match, use =, for example, \"<code>given_name</code> = \\\"Jon\\\"\". For a prefix (\"starts with\") match, use ^=, for example, \"<code>given_name</code> ^= \\\"Jon\\\"\". </p> </li> <li> <p> <i>AttributeValue</i>: The attribute value that must be matched for each user.</p> </li> </ul> <p>If the filter string is empty, <code>ListUsers</code> returns all users in the user pool.</p> <p>You can only search for the following standard attributes:</p> <ul> <li> <p> <code>username</code> (case-sensitive)</p> </li> <li> <p> <code>email</code> </p> </li> <li> <p> <code>phone_number</code> </p> </li> <li> <p> <code>name</code> </p> </li> <li> <p> <code>given_name</code> </p> </li> <li> <p> <code>family_name</code> </p> </li> <li> <p> <code>preferred_username</code> </p> </li> <li> <p> <code>cognito:user_status</code> (called <b>Enabled</b> in the Console) (case-sensitive)</p> </li> <li> <p> <code>status</code> (case-insensitive)</p> </li> </ul> <p>Custom attributes are not searchable.</p> <p>For more information, see <a href=\"http://docs.aws.amazon.com/cognito/latest/developerguide/how-to-manage-user-accounts.html#cognito-user-pools-searching-for-users-using-listusers-api\">Searching for Users Using the ListUsers API</a> and <a href=\"http://docs.aws.amazon.com/cognito/latest/developerguide/how-to-manage-user-accounts.html#cognito-user-pools-searching-for-users-listusers-api-examples\">Examples of Using the ListUsers API</a> in the <i>Amazon Cognito Developer Guide</i>.</p>"
        }
      },
      "documentation":"<p>Represents the request to list users.</p>"
    },
    "ListUsersResponse":{
      "type":"structure",
      "members":{
        "Users":{
          "shape":"UsersListType",
          "documentation":"<p>The users returned in the request to list users.</p>"
        },
        "PaginationToken":{
          "shape":"SearchPaginationTokenType",
          "documentation":"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"
        }
      },
      "documentation":"<p>The response from the request to list users.</p>"
    },
    "LogoutURLsListType":{
      "type":"list",
      "member":{"shape":"RedirectUrlType"},
      "max":100,
      "min":0
    },
    "LongType":{"type":"long"},
    "MFAMethodNotFoundException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when Amazon Cognito throws an MFA method not found exception.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when Amazon Cognito cannot find a multi-factor authentication (MFA) method.</p>",
      "exception":true
    },
    "MFAOptionListType":{
      "type":"list",
      "member":{"shape":"MFAOptionType"}
    },
    "MFAOptionType":{
      "type":"structure",
      "members":{
        "DeliveryMedium":{
          "shape":"DeliveryMediumType",
          "documentation":"<p>The delivery medium (email message or SMS message) to send the MFA code.</p>"
        },
        "AttributeName":{
          "shape":"AttributeNameType",
          "documentation":"<p>The attribute name of the MFA option type.</p>"
        }
      },
      "documentation":"<p>Specifies the different settings for multi-factor authentication (MFA).</p>"
    },
    "MessageActionType":{
      "type":"string",
      "enum":[
        "RESEND",
        "SUPPRESS"
      ]
    },
    "MessageTemplateType":{
      "type":"structure",
      "members":{
        "SMSMessage":{
          "shape":"SmsVerificationMessageType",
          "documentation":"<p>The message template for SMS messages.</p>"
        },
        "EmailMessage":{
          "shape":"EmailVerificationMessageType",
          "documentation":"<p>The message template for email messages.</p>"
        },
        "EmailSubject":{
          "shape":"EmailVerificationSubjectType",
          "documentation":"<p>The subject line for email messages.</p>"
        }
      },
      "documentation":"<p>The message template structure.</p>"
    },
    "MessageType":{"type":"string"},
    "NewDeviceMetadataType":{
      "type":"structure",
      "members":{
        "DeviceKey":{
          "shape":"DeviceKeyType",
          "documentation":"<p>The device key.</p>"
        },
        "DeviceGroupKey":{
          "shape":"StringType",
          "documentation":"<p>The device group key.</p>"
        }
      },
      "documentation":"<p>The new device metadata type.</p>"
    },
    "NotAuthorizedException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the Amazon Cognito service returns a not authorized exception.</p>"
        }
      },
      "documentation":"<p>This exception gets thrown when a user is not authorized.</p>",
      "exception":true
    },
    "NotifyConfigurationType":{
      "type":"structure",
      "required":["SourceArn"],
      "members":{
        "From":{"shape":"StringType"},
        "ReplyTo":{"shape":"StringType"},
        "SourceArn":{"shape":"ArnType"},
        "BlockEmail":{"shape":"NotifyEmailType"},
        "NoActionEmail":{"shape":"NotifyEmailType"},
        "MfaEmail":{"shape":"NotifyEmailType"}
      }
    },
    "NotifyEmailType":{
      "type":"structure",
      "required":["Subject"],
      "members":{
        "Subject":{"shape":"EmailNotificationSubjectType"},
        "HtmlBody":{"shape":"EmailNotificationBodyType"},
        "TextBody":{"shape":"EmailNotificationBodyType"}
      }
    },
    "NumberAttributeConstraintsType":{
      "type":"structure",
      "members":{
        "MinValue":{
          "shape":"StringType",
          "documentation":"<p>The minimum value of an attribute that is of the number data type.</p>"
        },
        "MaxValue":{
          "shape":"StringType",
          "documentation":"<p>The maximum value of an attribute that is of the number data type.</p>"
        }
      },
      "documentation":"<p>The minimum and maximum value of an attribute that is of the number data type.</p>"
    },
    "OAuthFlowType":{
      "type":"string",
      "enum":[
        "code",
        "implicit",
        "client_credentials"
      ]
    },
    "OAuthFlowsType":{
      "type":"list",
      "member":{"shape":"OAuthFlowType"},
      "max":3,
      "min":0
    },
    "PaginationKey":{
      "type":"string",
      "min":1,
      "pattern":"[\\S]+"
    },
    "PaginationKeyType":{
      "type":"string",
      "min":1,
      "pattern":"[\\S]+"
    },
    "PasswordClaimType":{
      "type":"structure",
      "members":{
        "SecretBlock":{
          "shape":"BlobType",
          "documentation":"<p>A secret block claim type for a password.</p>"
        },
        "Signature":{
          "shape":"BlobType",
          "documentation":"<p>A signature claim type for a password.</p>"
        }
      },
      "documentation":"<p>The claim type of a password.</p>",
      "sensitive":true
    },
    "PasswordPolicyMinLengthType":{
      "type":"integer",
      "max":99,
      "min":6
    },
    "PasswordPolicyType":{
      "type":"structure",
      "members":{
        "MinimumLength":{
          "shape":"PasswordPolicyMinLengthType",
          "documentation":"<p>The minimum length of the password policy that you have set. Cannot be less than 6.</p>"
        },
        "RequireUppercase":{
          "shape":"BooleanType",
          "documentation":"<p>In the password policy that you have set, refers to whether you have required users to use at least one uppercase letter in their password.</p>"
        },
        "RequireLowercase":{
          "shape":"BooleanType",
          "documentation":"<p>In the password policy that you have set, refers to whether you have required users to use at least one lowercase letter in their password.</p>"
        },
        "RequireNumbers":{
          "shape":"BooleanType",
          "documentation":"<p>In the password policy that you have set, refers to whether you have required users to use at least one number in their password.</p>"
        },
        "RequireSymbols":{
          "shape":"BooleanType",
          "documentation":"<p>In the password policy that you have set, refers to whether you have required users to use at least one symbol in their password.</p>"
        }
      },
      "documentation":"<p>The password policy type.</p>"
    },
    "PasswordResetRequiredException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when a password reset is required.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when a password reset is required.</p>",
      "exception":true
    },
    "PasswordType":{
      "type":"string",
      "max":256,
      "min":6,
      "pattern":"[\\S]+",
      "sensitive":true
    },
    "PoolQueryLimitType":{
      "type":"integer",
      "max":60,
      "min":1
    },
    "PreSignedUrlType":{
      "type":"string",
      "max":2048,
      "min":0
    },
    "PrecedenceType":{
      "type":"integer",
      "min":0
    },
    "PreconditionNotMetException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when a precondition is not met.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when a precondition is not met.</p>",
      "exception":true
    },
    "ProviderDescription":{
      "type":"structure",
      "members":{
        "ProviderName":{"shape":"ProviderNameType"},
        "ProviderType":{"shape":"IdentityProviderTypeType"},
        "LastModifiedDate":{"shape":"DateType"},
        "CreationDate":{"shape":"DateType"}
      }
    },
    "ProviderDetailsType":{
      "type":"map",
      "key":{"shape":"StringType"},
      "value":{"shape":"StringType"}
    },
    "ProviderNameType":{
      "type":"string",
      "max":32,
      "min":1,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"
    },
    "ProviderNameTypeV1":{
      "type":"string",
      "max":32,
      "min":1,
      "pattern":"[^_][\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}][^_]+"
    },
    "ProviderUserIdentifierType":{
      "type":"structure",
      "members":{
        "ProviderName":{"shape":"ProviderNameType"},
        "ProviderAttributeName":{"shape":"StringType"},
        "ProviderAttributeValue":{"shape":"StringType"}
      }
    },
    "ProvidersListType":{
      "type":"list",
      "member":{"shape":"ProviderDescription"},
      "max":50,
      "min":0
    },
    "QueryLimit":{
      "type":"integer",
      "max":60,
      "min":1
    },
    "QueryLimitType":{
      "type":"integer",
      "max":60,
      "min":0
    },
    "RedirectUrlType":{
      "type":"string",
      "max":1024,
      "min":1,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"
    },
    "RefreshTokenValidityType":{
      "type":"integer",
      "max":3650,
      "min":0
    },
    "RefreshTokensRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "RefreshToken"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "ClientSecret":{
          "shape":"ClientSecretType",
          "documentation":"<p>The client secret for a user's request to refresh tokens.</p>"
        },
        "RefreshToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The refresh token for a user's request to refresh tokens.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"}
      },
      "documentation":"<p>Represents the request to refresh tokens.</p>"
    },
    "RefreshTokensResponse":{
      "type":"structure",
      "members":{
        "AuthenticationResult":{
          "shape":"AuthenticationResultType",
          "documentation":"<p>The authentication result from the server's response to the request to refresh tokens.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server when the user wants to refresh tokens.</p>"
    },
    "ResendConfirmationCodeRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "Username"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "SecretHash":{
          "shape":"SecretHashType",
          "documentation":"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"
        },
        "UserContextData":{"shape":"UserContextDataType"},
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user to whom you wish to resend a confirmation code.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"}
      },
      "documentation":"<p>Represents the request to resend the confirmation code.</p>"
    },
    "ResendConfirmationCodeResponse":{
      "type":"structure",
      "members":{
        "CodeDeliveryDetails":{
          "shape":"CodeDeliveryDetailsType",
          "documentation":"<p>The code delivery details returned by the server in response to the request to resend the confirmation code.</p>"
        }
      },
      "documentation":"<p>The response from the server when the Amazon Cognito Your User Pools service makes the request to resend a confirmation code.</p>"
    },
    "ResourceNotFoundException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the Amazon Cognito service returns a resource not found exception.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when the Amazon Cognito service cannot find the requested resource.</p>",
      "exception":true
    },
    "ResourceServerIdentifierType":{
      "type":"string",
      "max":256,
      "min":1,
      "pattern":"[\\x21\\x23-\\x5B\\x5D-\\x7E]+"
    },
    "ResourceServerNameType":{
      "type":"string",
      "max":256,
      "min":1,
      "pattern":"[\\w\\s+=,.@-]+"
    },
    "ResourceServerScopeDescriptionType":{
      "type":"string",
      "max":256,
      "min":1
    },
    "ResourceServerScopeListType":{
      "type":"list",
      "member":{"shape":"ResourceServerScopeType"},
      "max":25
    },
    "ResourceServerScopeNameType":{
      "type":"string",
      "max":256,
      "min":1,
      "pattern":"[\\x21\\x23-\\x2E\\x30-\\x5B\\x5D-\\x7E]+"
    },
    "ResourceServerScopeType":{
      "type":"structure",
      "required":[
        "ScopeName",
        "ScopeDescription"
      ],
      "members":{
        "ScopeName":{"shape":"ResourceServerScopeNameType"},
        "ScopeDescription":{"shape":"ResourceServerScopeDescriptionType"}
      }
    },
    "ResourceServerType":{
      "type":"structure",
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Identifier":{"shape":"ResourceServerIdentifierType"},
        "Name":{"shape":"ResourceServerNameType"},
        "Scopes":{"shape":"ResourceServerScopeListType"}
      }
    },
    "ResourceServersListType":{
      "type":"list",
      "member":{"shape":"ResourceServerType"}
    },
    "RespondToAuthChallengeRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "ChallengeName"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The app client ID.</p>"
        },
        "ChallengeName":{
          "shape":"ChallengeNameType",
          "documentation":"<p>The challenge name. For more information, see <a href=\"API_InitiateAuth.html\">InitiateAuth</a>.</p> <p> <code>ADMIN_NO_SRP_AUTH</code> is not a valid value.</p>"
        },
        "Session":{
          "shape":"SessionType",
          "documentation":"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"
        },
        "ChallengeResponses":{
          "shape":"ChallengeResponsesType",
          "documentation":"<p>The challenge responses. These are inputs corresponding to the value of <code>ChallengeName</code>, for example:</p> <ul> <li> <p> <code>SMS_MFA</code>: <code>SMS_MFA_CODE</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret).</p> </li> <li> <p> <code>PASSWORD_VERIFIER</code>: <code>PASSWORD_CLAIM_SIGNATURE</code>, <code>PASSWORD_CLAIM_SECRET_BLOCK</code>, <code>TIMESTAMP</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret).</p> </li> <li> <p> <code>NEW_PASSWORD_REQUIRED</code>: <code>NEW_PASSWORD</code>, any other required attributes, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret). </p> </li> </ul>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"},
        "UserContextData":{"shape":"UserContextDataType"}
      },
      "documentation":"<p>The request to respond to an authentication challenge.</p>"
    },
    "RespondToAuthChallengeResponse":{
      "type":"structure",
      "members":{
        "ChallengeName":{
          "shape":"ChallengeNameType",
          "documentation":"<p>The challenge name. For more information, see <a href=\"API_InitiateAuth.html\">InitiateAuth</a>.</p>"
        },
        "Session":{
          "shape":"SessionType",
          "documentation":"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"
        },
        "ChallengeParameters":{
          "shape":"ChallengeParametersType",
          "documentation":"<p>The challenge parameters. For more information, see <a href=\"API_InitiateAuth.html\">InitiateAuth</a>.</p>"
        },
        "AuthenticationResult":{
          "shape":"AuthenticationResultType",
          "documentation":"<p>The result returned by the server in response to the request to respond to the authentication challenge.</p>"
        }
      },
      "documentation":"<p>The response to respond to the authentication challenge.</p>"
    },
    "RiskConfigurationType":{
      "type":"structure",
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ClientId":{"shape":"ClientIdType"},
        "CompromisedCredentialsRiskConfiguration":{"shape":"CompromisedCredentialsRiskConfigurationType"},
        "BotRiskConfiguration":{"shape":"BotRiskConfigurationType"},
        "AccountTakeoverRiskConfiguration":{"shape":"AccountTakeoverRiskConfigurationType"},
        "RiskExceptionConfiguration":{"shape":"RiskExceptionConfigurationType"},
        "LastModifiedDate":{"shape":"DateType"}
      }
    },
    "RiskDecisionType":{
      "type":"string",
      "enum":[
        "NoRisk",
        "Bot",
        "AccountTakeover"
      ]
    },
    "RiskExceptionConfigurationType":{
      "type":"structure",
      "members":{
        "BlockedIPRangeList":{"shape":"BlockedIPRangeListType"},
        "SkippedIPRangeList":{"shape":"SkippedIPRangeListType"}
      }
    },
    "RiskLevelType":{
      "type":"string",
      "enum":[
        "Low",
        "Medium",
        "High"
      ]
    },
    "S3BucketType":{
      "type":"string",
      "max":1024,
      "min":3,
      "pattern":"^[0-9A-Za-z\\.\\-_]*(?<!\\.)$"
    },
    "SMSMfaSettingsType":{
      "type":"structure",
      "members":{
        "Enabled":{"shape":"BooleanType"},
        "PreferredMfa":{"shape":"BooleanType"}
      }
    },
    "SchemaAttributeType":{
      "type":"structure",
      "members":{
        "Name":{
          "shape":"CustomAttributeNameType",
          "documentation":"<p>A schema attribute of the name type.</p>"
        },
        "AttributeDataType":{
          "shape":"AttributeDataType",
          "documentation":"<p>The attribute data type.</p>"
        },
        "DeveloperOnlyAttribute":{
          "shape":"BooleanType",
          "documentation":"<p>Specifies whether the attribute type is developer only.</p>",
          "box":true
        },
        "Mutable":{
          "shape":"BooleanType",
          "documentation":"<p>Specifies whether the attribute can be changed once it has been created.</p>",
          "box":true
        },
        "Required":{
          "shape":"BooleanType",
          "documentation":"<p>Specifies whether a user pool attribute is required. If the attribute is required and the user does not provide a value, registration or sign-in will fail.</p>",
          "box":true
        },
        "NumberAttributeConstraints":{
          "shape":"NumberAttributeConstraintsType",
          "documentation":"<p>Specifies the constraints for an attribute of the number type.</p>"
        },
        "StringAttributeConstraints":{
          "shape":"StringAttributeConstraintsType",
          "documentation":"<p>Specifies the constraints for an attribute of the string type.</p>"
        }
      },
      "documentation":"<p>Contains information about the schema attribute.</p>"
    },
    "SchemaAttributesListType":{
      "type":"list",
      "member":{"shape":"SchemaAttributeType"},
      "max":50,
      "min":1
    },
    "ScopeDoesNotExistException":{
      "type":"structure",
      "members":{
        "message":{"shape":"MessageType"}
      },
      "exception":true
    },
    "ScopeListType":{
      "type":"list",
      "member":{"shape":"ScopeType"},
      "max":25
    },
    "ScopeType":{
      "type":"string",
      "max":256,
      "min":1,
      "pattern":"[\\x21\\x23-\\x5B\\x5D-\\x7E]+"
    },
    "SearchPaginationTokenType":{
      "type":"string",
      "min":1,
      "pattern":"[\\S]+"
    },
    "SearchedAttributeNamesListType":{
      "type":"list",
      "member":{"shape":"AttributeNameType"}
    },
    "SecretCodeType":{
      "type":"string",
      "min":16,
      "pattern":"[A-Za-z0-9]+",
      "sensitive":true
    },
    "SecretHashType":{
      "type":"string",
      "max":128,
      "min":1,
      "pattern":"[\\w+=/]+",
      "sensitive":true
    },
    "SessionType":{
      "type":"string",
      "max":2048,
      "min":20
    },
    "SetRiskConfigurationRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ClientId":{"shape":"ClientIdType"},
        "CompromisedCredentialsRiskConfiguration":{"shape":"CompromisedCredentialsRiskConfigurationType"},
        "BotRiskConfiguration":{"shape":"BotRiskConfigurationType"},
        "AccountTakeoverRiskConfiguration":{"shape":"AccountTakeoverRiskConfigurationType"},
        "RiskExceptionConfiguration":{"shape":"RiskExceptionConfigurationType"}
      }
    },
    "SetRiskConfigurationResponse":{
      "type":"structure",
      "required":["RiskConfiguration"],
      "members":{
        "RiskConfiguration":{"shape":"RiskConfigurationType"}
      }
    },
    "SetUICustomizationRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ClientId":{"shape":"ClientIdType"},
        "CSS":{"shape":"CSSType"},
        "ImageFile":{"shape":"ImageFileType"}
      }
    },
    "SetUICustomizationResponse":{
      "type":"structure",
      "required":["UICustomization"],
      "members":{
        "UICustomization":{"shape":"UICustomizationType"}
      }
    },
    "SetUserMFAPreferenceRequest":{
      "type":"structure",
      "required":["AccessToken"],
      "members":{
        "SMSMfaSettings":{"shape":"SMSMfaSettingsType"},
        "SoftwareTokenMfaSettings":{"shape":"SoftwareTokenMfaSettingsType"},
        "AccessToken":{"shape":"TokenModelType"}
      }
    },
    "SetUserMFAPreferenceResponse":{
      "type":"structure",
      "members":{
      }
    },
    "SetUserPoolMfaConfigRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "SmsMfaConfiguration":{"shape":"SmsMfaConfigType"},
        "SoftwareTokenMfaConfiguration":{"shape":"SoftwareTokenMfaConfigType"},
        "MfaConfiguration":{"shape":"UserPoolMfaType"}
      }
    },
    "SetUserPoolMfaConfigResponse":{
      "type":"structure",
      "members":{
        "SmsMfaConfiguration":{"shape":"SmsMfaConfigType"},
        "SoftwareTokenMfaConfiguration":{"shape":"SoftwareTokenMfaConfigType"},
        "MfaConfiguration":{"shape":"UserPoolMfaType"}
      }
    },
    "SetUserPoolUIConfigurationRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Details":{"shape":"UIDetailsMapType"}
      }
    },
    "SetUserPoolUIConfigurationResponse":{
      "type":"structure",
      "required":["UserPoolUIConfiguration"],
      "members":{
        "UserPoolUIConfiguration":{"shape":"UserPoolUIConfigurationType"}
      }
    },
    "SetUserSettingsRequest":{
      "type":"structure",
      "required":[
        "AccessToken",
        "MFAOptions"
      ],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token for the set user settings request.</p>"
        },
        "MFAOptions":{
          "shape":"MFAOptionListType",
          "documentation":"<p>Specifies the options for MFA (e.g., email or phone number).</p>"
        }
      },
      "documentation":"<p>Represents the request to set user settings.</p>"
    },
    "SetUserSettingsResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>The response from the server for a set user settings request.</p>"
    },
    "SignUpRequest":{
      "type":"structure",
      "required":[
        "ClientId",
        "Username",
        "Password"
      ],
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "SecretHash":{
          "shape":"SecretHashType",
          "documentation":"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"
        },
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user you wish to register.</p>"
        },
        "Password":{
          "shape":"PasswordType",
          "documentation":"<p>The password of the user you wish to register.</p>"
        },
        "UserAttributes":{
          "shape":"AttributeListType",
          "documentation":"<p>An array of name-value pairs representing user attributes.</p>"
        },
        "ValidationData":{
          "shape":"AttributeListType",
          "documentation":"<p>The validation data in the request to register a user.</p>"
        },
        "AnalyticsMetadata":{"shape":"AnalyticsMetadataType"},
        "UserContextData":{"shape":"UserContextDataType"}
      },
      "documentation":"<p>Represents the request to register a user.</p>"
    },
    "SignUpResponse":{
      "type":"structure",
      "required":[
        "UserConfirmed",
        "UserSub"
      ],
      "members":{
        "UserConfirmed":{
          "shape":"BooleanType",
          "documentation":"<p>A response from the server indicating that a user registration has been confirmed.</p>"
        },
        "CodeDeliveryDetails":{
          "shape":"CodeDeliveryDetailsType",
          "documentation":"<p>The code delivery details returned by the server response to the user registration request.</p>"
        },
        "UserSub":{"shape":"StringType"}
      },
      "documentation":"<p>The response from the server for a registration request.</p>"
    },
    "SkippedIPRangeListType":{
      "type":"list",
      "member":{"shape":"StringType"},
      "max":20
    },
    "SmsConfigurationType":{
      "type":"structure",
      "required":["SnsCallerArn"],
      "members":{
        "SnsCallerArn":{
          "shape":"ArnType",
          "documentation":"<p>The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) caller.</p>"
        },
        "ExternalId":{
          "shape":"StringType",
          "documentation":"<p>The external ID.</p>"
        }
      },
      "documentation":"<p>The SMS configuration type.</p>"
    },
    "SmsMfaConfigType":{
      "type":"structure",
      "members":{
        "SmsAuthenticationMessage":{"shape":"SmsVerificationMessageType"},
        "SmsConfiguration":{"shape":"SmsConfigurationType"}
      }
    },
    "SmsVerificationMessageType":{
      "type":"string",
      "max":140,
      "min":6,
      "pattern":".*\\{####\\}.*"
    },
    "SoftwareTokenMFANotFoundException":{
      "type":"structure",
      "members":{
        "message":{"shape":"MessageType"}
      },
      "exception":true
    },
    "SoftwareTokenMFAUserCodeType":{
      "type":"string",
      "max":6,
      "min":6,
      "pattern":"[0-9]+"
    },
    "SoftwareTokenMfaConfigType":{
      "type":"structure",
      "members":{
        "Enabled":{"shape":"BooleanType"}
      }
    },
    "SoftwareTokenMfaSettingsType":{
      "type":"structure",
      "members":{
        "Enabled":{"shape":"BooleanType"},
        "PreferredMfa":{"shape":"BooleanType"}
      }
    },
    "StartUserImportJobRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "JobId"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool that the users are being imported into.</p>"
        },
        "JobId":{
          "shape":"UserImportJobIdType",
          "documentation":"<p>The job ID for the user import job.</p>"
        }
      },
      "documentation":"<p>Represents the request to start the user import job.</p>"
    },
    "StartUserImportJobResponse":{
      "type":"structure",
      "members":{
        "UserImportJob":{
          "shape":"UserImportJobType",
          "documentation":"<p>The job object that represents the user import job.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to the request to start the user import job.</p>"
    },
    "StatusType":{
      "type":"string",
      "enum":[
        "Enabled",
        "Disabled"
      ]
    },
    "StopUserImportJobRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "JobId"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool that the users are being imported into.</p>"
        },
        "JobId":{
          "shape":"UserImportJobIdType",
          "documentation":"<p>The job ID for the user import job.</p>"
        }
      },
      "documentation":"<p>Represents the request to stop the user import job.</p>"
    },
    "StopUserImportJobResponse":{
      "type":"structure",
      "members":{
        "UserImportJob":{
          "shape":"UserImportJobType",
          "documentation":"<p>The job object that represents the user import job.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to the request to stop the user import job.</p>"
    },
    "StringAttributeConstraintsType":{
      "type":"structure",
      "members":{
        "MinLength":{
          "shape":"StringType",
          "documentation":"<p>The minimum length of an attribute value of the string type.</p>"
        },
        "MaxLength":{
          "shape":"StringType",
          "documentation":"<p>The maximum length of an attribute value of the string type.</p>"
        }
      },
      "documentation":"<p>The type of constraints associated with an attribute of the string type.</p>"
    },
    "StringType":{"type":"string"},
    "SupportedIdentityProvidersListType":{
      "type":"list",
      "member":{"shape":"ProviderNameType"}
    },
    "TokenModelType":{
      "type":"string",
      "pattern":"[A-Za-z0-9-_=.]+",
      "sensitive":true
    },
    "TooManyFailedAttemptsException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the Amazon Cognito service returns a too many failed attempts exception.</p>"
        }
      },
      "documentation":"<p>This exception gets thrown when the user has made too many failed attempts for a given action (e.g., sign in).</p>",
      "exception":true
    },
    "TooManyRequestsException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the Amazon Cognito service returns a too many requests exception.</p>"
        }
      },
      "documentation":"<p>This exception gets thrown when the user has made too many requests for a given operation.</p>",
      "exception":true
    },
    "UICustomizationType":{
      "type":"structure",
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ClientId":{"shape":"ClientIdType"},
        "ImageUrl":{"shape":"ImageUrlType"},
        "CSS":{"shape":"CSSType"},
        "CSSVersion":{"shape":"CSSVersionType"},
        "LastModifiedDate":{"shape":"DateType"},
        "CreationDate":{"shape":"DateType"}
      }
    },
    "UIDetailsMapType":{
      "type":"map",
      "key":{"shape":"StringType"},
      "value":{"shape":"StringType"}
    },
    "UnexpectedLambdaException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the Amazon Cognito service returns an unexpected AWS Lambda exception.</p>"
        }
      },
      "documentation":"<p>This exception gets thrown when the Amazon Cognito service encounters an unexpected exception with the AWS Lambda service.</p>",
      "exception":true
    },
    "UnsupportedIdentityProviderException":{
      "type":"structure",
      "members":{
        "message":{"shape":"MessageType"}
      },
      "exception":true
    },
    "UnsupportedUserStateException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the user is in an unsupported state.</p>"
        }
      },
      "documentation":"<p>The request failed because the user is in an unsupported state.</p>",
      "exception":true
    },
    "UpdateAuthEventFeedbackRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Username",
        "EventId",
        "FeedbackToken",
        "FeedbackValue"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Username":{"shape":"UsernameType"},
        "EventId":{"shape":"EventIdType"},
        "FeedbackToken":{"shape":"TokenModelType"},
        "FeedbackValue":{"shape":"FeedbackValueType"}
      }
    },
    "UpdateAuthEventFeedbackResponse":{
      "type":"structure",
      "members":{
      }
    },
    "UpdateDeviceStatusRequest":{
      "type":"structure",
      "required":[
        "AccessToken",
        "DeviceKey"
      ],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token.</p>"
        },
        "DeviceKey":{
          "shape":"DeviceKeyType",
          "documentation":"<p>The device key.</p>"
        },
        "DeviceRememberedStatus":{
          "shape":"DeviceRememberedStatusType",
          "documentation":"<p>The status of whether a device is remembered.</p>"
        }
      },
      "documentation":"<p>Represents the request to update the device status.</p>"
    },
    "UpdateDeviceStatusResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>The response to the request to update the device status.</p>"
    },
    "UpdateGroupRequest":{
      "type":"structure",
      "required":[
        "GroupName",
        "UserPoolId"
      ],
      "members":{
        "GroupName":{
          "shape":"GroupNameType",
          "documentation":"<p>The name of the group.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool.</p>"
        },
        "Description":{
          "shape":"DescriptionType",
          "documentation":"<p>A string containing the new description of the group.</p>"
        },
        "RoleArn":{
          "shape":"ArnType",
          "documentation":"<p>The new role ARN for the group. This is used for setting the <code>cognito:roles</code> and <code>cognito:preferred_role</code> claims in the token.</p>"
        },
        "Precedence":{
          "shape":"PrecedenceType",
          "documentation":"<p>The new precedence value for the group. For more information about this parameter, see <a href=\"API_CreateGroup.html\">CreateGroup</a>.</p>"
        }
      }
    },
    "UpdateGroupResponse":{
      "type":"structure",
      "members":{
        "Group":{
          "shape":"GroupType",
          "documentation":"<p>The group object for the group.</p>"
        }
      }
    },
    "UpdateIdentityProviderRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ProviderName"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "ProviderName":{"shape":"ProviderNameType"},
        "ProviderDetails":{"shape":"ProviderDetailsType"},
        "AttributeMapping":{"shape":"AttributeMappingType"},
        "IdpIdentifiers":{"shape":"IdpIdentifiersListType"}
      }
    },
    "UpdateIdentityProviderResponse":{
      "type":"structure",
      "required":["IdentityProvider"],
      "members":{
        "IdentityProvider":{"shape":"IdentityProviderType"}
      }
    },
    "UpdateResourceServerRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "Identifier",
        "Name"
      ],
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Identifier":{"shape":"ResourceServerIdentifierType"},
        "Name":{"shape":"ResourceServerNameType"},
        "Scopes":{"shape":"ResourceServerScopeListType"}
      }
    },
    "UpdateResourceServerResponse":{
      "type":"structure",
      "required":["ResourceServer"],
      "members":{
        "ResourceServer":{"shape":"ResourceServerType"}
      }
    },
    "UpdateUserAttributesRequest":{
      "type":"structure",
      "required":[
        "UserAttributes",
        "AccessToken"
      ],
      "members":{
        "UserAttributes":{
          "shape":"AttributeListType",
          "documentation":"<p>An array of name-value pairs representing user attributes.</p>"
        },
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>The access token for the request to update user attributes.</p>"
        }
      },
      "documentation":"<p>Represents the request to update user attributes.</p>"
    },
    "UpdateUserAttributesResponse":{
      "type":"structure",
      "members":{
        "CodeDeliveryDetailsList":{
          "shape":"CodeDeliveryDetailsListType",
          "documentation":"<p>The code delivery details list from the server for the request to update user attributes.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server for the request to update user attributes.</p>"
    },
    "UpdateUserPoolClientRequest":{
      "type":"structure",
      "required":[
        "UserPoolId",
        "ClientId"
      ],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to update the user pool client.</p>"
        },
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "ClientName":{
          "shape":"ClientNameType",
          "documentation":"<p>The client name from the update user pool client request.</p>"
        },
        "RefreshTokenValidity":{
          "shape":"RefreshTokenValidityType",
          "documentation":"<p>The time limit, in days, after which the refresh token is no longer valid and cannot be used.</p>"
        },
        "ReadAttributes":{
          "shape":"ClientPermissionListType",
          "documentation":"<p>The read-only attributes of the user pool.</p>"
        },
        "WriteAttributes":{
          "shape":"ClientPermissionListType",
          "documentation":"<p>The writeable attributes of the user pool.</p>"
        },
        "ExplicitAuthFlows":{
          "shape":"ExplicitAuthFlowsListType",
          "documentation":"<p>Explicit authentication flows.</p>"
        },
        "SupportedIdentityProviders":{"shape":"SupportedIdentityProvidersListType"},
        "CallbackURLs":{"shape":"CallbackURLsListType"},
        "LogoutURLs":{"shape":"LogoutURLsListType"},
        "DefaultRedirectURI":{"shape":"RedirectUrlType"},
        "AllowedOAuthFlows":{"shape":"OAuthFlowsType"},
        "AllowedOAuthScopes":{"shape":"ScopeListType"},
        "AllowedOAuthFlowsUserPoolClient":{"shape":"BooleanType"},
        "AnalyticsConfiguration":{"shape":"AnalyticsConfigurationType"}
      },
      "documentation":"<p>Represents the request to update the user pool client.</p>"
    },
    "UpdateUserPoolClientResponse":{
      "type":"structure",
      "members":{
        "UserPoolClient":{
          "shape":"UserPoolClientType",
          "documentation":"<p>The user pool client value from the response from the server when an update user pool client request is made.</p>"
        }
      },
      "documentation":"<p>Represents the response from the server to the request to update the user pool client.</p>"
    },
    "UpdateUserPoolRequest":{
      "type":"structure",
      "required":["UserPoolId"],
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool you want to update.</p>"
        },
        "Policies":{
          "shape":"UserPoolPolicyType",
          "documentation":"<p>A container with the policies you wish to update in a user pool.</p>"
        },
        "LambdaConfig":{
          "shape":"LambdaConfigType",
          "documentation":"<p>The AWS Lambda configuration information from the request to update the user pool.</p>"
        },
        "AutoVerifiedAttributes":{
          "shape":"VerifiedAttributesListType",
          "documentation":"<p>The attributes that are automatically verified when the Amazon Cognito service makes a request to update user pools.</p>"
        },
        "SmsVerificationMessage":{
          "shape":"SmsVerificationMessageType",
          "documentation":"<p>A container with information about the SMS verification message.</p>"
        },
        "EmailVerificationMessage":{
          "shape":"EmailVerificationMessageType",
          "documentation":"<p>The contents of the email verification message.</p>"
        },
        "EmailVerificationSubject":{
          "shape":"EmailVerificationSubjectType",
          "documentation":"<p>The subject of the email verification message.</p>"
        },
        "VerificationMessageTemplate":{"shape":"VerificationMessageTemplateType"},
        "SmsAuthenticationMessage":{
          "shape":"SmsVerificationMessageType",
          "documentation":"<p>The contents of the SMS authentication message.</p>"
        },
        "MfaConfiguration":{
          "shape":"UserPoolMfaType",
          "documentation":"<p>Can be one of the following values:</p> <ul> <li> <p> <code>OFF</code> - MFA tokens are not required and cannot be specified during user registration.</p> </li> <li> <p> <code>ON</code> - MFA tokens are required for all user registrations. You can only specify required when you are initially creating a user pool.</p> </li> <li> <p> <code>OPTIONAL</code> - Users have the option when registering to create an MFA token.</p> </li> </ul>"
        },
        "DeviceConfiguration":{
          "shape":"DeviceConfigurationType",
          "documentation":"<p>Device configuration.</p>"
        },
        "EmailConfiguration":{
          "shape":"EmailConfigurationType",
          "documentation":"<p>Email configuration.</p>"
        },
        "SmsConfiguration":{
          "shape":"SmsConfigurationType",
          "documentation":"<p>SMS configuration.</p>"
        },
        "UserPoolTags":{
          "shape":"UserPoolTagsType",
          "documentation":"<p>The cost allocation tags for the user pool. For more information, see <a href=\"http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-cost-allocation-tagging.html\">Adding Cost Allocation Tags to Your User Pool</a> </p>"
        },
        "AdminCreateUserConfig":{
          "shape":"AdminCreateUserConfigType",
          "documentation":"<p>The configuration for AdminCreateUser requests.</p>"
        },
        "UserPoolAddOns":{"shape":"UserPoolAddOnsType"}
      },
      "documentation":"<p>Represents the request to update the user pool.</p>"
    },
    "UpdateUserPoolResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>Represents the response from the server when you make a request to update the user pool.</p>"
    },
    "UserContextDataType":{
      "type":"structure",
      "members":{
        "encodedData":{"shape":"StringType"}
      }
    },
    "UserFilterType":{
      "type":"string",
      "max":256
    },
    "UserImportInProgressException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the user pool has an import job running.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when you are trying to modify a user pool while a user import job is in progress for that pool.</p>",
      "exception":true
    },
    "UserImportJobIdType":{
      "type":"string",
      "max":55,
      "min":1,
      "pattern":"import-[0-9a-zA-Z-]+"
    },
    "UserImportJobNameType":{
      "type":"string",
      "max":128,
      "min":1,
      "pattern":"[\\w\\s+=,.@-]+"
    },
    "UserImportJobStatusType":{
      "type":"string",
      "enum":[
        "Created",
        "Pending",
        "InProgress",
        "Stopping",
        "Expired",
        "Stopped",
        "Failed",
        "Succeeded"
      ]
    },
    "UserImportJobType":{
      "type":"structure",
      "members":{
        "JobName":{
          "shape":"UserImportJobNameType",
          "documentation":"<p>The job name for the user import job.</p>"
        },
        "JobId":{
          "shape":"UserImportJobIdType",
          "documentation":"<p>The job ID for the user import job.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool that the users are being imported into.</p>"
        },
        "PreSignedUrl":{
          "shape":"PreSignedUrlType",
          "documentation":"<p>The pre-signed URL to be used to upload the .csv file.</p>"
        },
        "CreationDate":{
          "shape":"DateType",
          "documentation":"<p>The date when the user import job was created.</p>"
        },
        "StartDate":{
          "shape":"DateType",
          "documentation":"<p>The date when the user import job was started.</p>"
        },
        "CompletionDate":{
          "shape":"DateType",
          "documentation":"<p>The date when the user import job was completed.</p>"
        },
        "Status":{
          "shape":"UserImportJobStatusType",
          "documentation":"<p>The status of the user import job. One of the following:</p> <ul> <li> <p>Created - The job was created but not started.</p> </li> <li> <p>Pending - A transition state. You have started the job, but it has not begun importing users yet.</p> </li> <li> <p>InProgress - The job has started, and users are being imported.</p> </li> <li> <p>Stopping - You have stopped the job, but the job has not stopped importing users yet.</p> </li> <li> <p>Stopped - You have stopped the job, and the job has stopped importing users.</p> </li> <li> <p>Succeeded - The job has completed successfully.</p> </li> <li> <p>Failed - The job has stopped due to an error.</p> </li> <li> <p>Expired - You created a job, but did not start the job within 24-48 hours. All data associated with the job was deleted, and the job cannot be started.</p> </li> </ul>"
        },
        "CloudWatchLogsRoleArn":{
          "shape":"ArnType",
          "documentation":"<p>The role ARN for the Amazon CloudWatch Logging role for the user import job. For more information, see \"Creating the CloudWatch Logs IAM Role\" in the Amazon Cognito Developer Guide.</p>"
        },
        "ImportedUsers":{
          "shape":"LongType",
          "documentation":"<p>The number of users that were successfully imported.</p>"
        },
        "SkippedUsers":{
          "shape":"LongType",
          "documentation":"<p>The number of users that were skipped.</p>"
        },
        "FailedUsers":{
          "shape":"LongType",
          "documentation":"<p>The number of users that could not be imported.</p>"
        },
        "CompletionMessage":{
          "shape":"CompletionMessageType",
          "documentation":"<p>The message returned when the user import job is completed.</p>"
        }
      },
      "documentation":"<p>The user import job type.</p>"
    },
    "UserImportJobsListType":{
      "type":"list",
      "member":{"shape":"UserImportJobType"},
      "max":50,
      "min":1
    },
    "UserLambdaValidationException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when the Amazon Cognito service returns a user validation exception with the AWS Lambda service.</p>"
        }
      },
      "documentation":"<p>This exception gets thrown when the Amazon Cognito service encounters a user validation exception with the AWS Lambda service.</p>",
      "exception":true
    },
    "UserNotConfirmedException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when a user is not confirmed successfully.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when a user is not confirmed successfully.</p>",
      "exception":true
    },
    "UserNotFoundException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when a user is not found.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when a user is not found.</p>",
      "exception":true
    },
    "UserPoolAddOnNotEnabledException":{
      "type":"structure",
      "members":{
        "message":{"shape":"MessageType"}
      },
      "exception":true
    },
    "UserPoolAddOnsType":{
      "type":"structure",
      "required":["AdvancedSecurityMode"],
      "members":{
        "AdvancedSecurityMode":{"shape":"AdvancedSecurityModeType"}
      }
    },
    "UserPoolClientDescription":{
      "type":"structure",
      "members":{
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool where you want to describe the user pool client.</p>"
        },
        "ClientName":{
          "shape":"ClientNameType",
          "documentation":"<p>The client name from the user pool client description.</p>"
        }
      },
      "documentation":"<p>The description of the user pool client.</p>"
    },
    "UserPoolClientListType":{
      "type":"list",
      "member":{"shape":"UserPoolClientDescription"}
    },
    "UserPoolClientType":{
      "type":"structure",
      "members":{
        "UserPoolId":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The user pool ID for the user pool client.</p>"
        },
        "ClientName":{
          "shape":"ClientNameType",
          "documentation":"<p>The client name from the user pool request of the client type.</p>"
        },
        "ClientId":{
          "shape":"ClientIdType",
          "documentation":"<p>The ID of the client associated with the user pool.</p>"
        },
        "ClientSecret":{
          "shape":"ClientSecretType",
          "documentation":"<p>The client secret from the user pool request of the client type.</p>"
        },
        "LastModifiedDate":{
          "shape":"DateType",
          "documentation":"<p>The last modified date from the user pool request of the client type.</p>"
        },
        "CreationDate":{
          "shape":"DateType",
          "documentation":"<p>The creation date from the user pool request of the client type.</p>"
        },
        "RefreshTokenValidity":{
          "shape":"RefreshTokenValidityType",
          "documentation":"<p>The time limit, in days, after which the refresh token is no longer valid and cannot be used.</p>"
        },
        "ReadAttributes":{
          "shape":"ClientPermissionListType",
          "documentation":"<p>The Read-only attributes.</p>"
        },
        "WriteAttributes":{
          "shape":"ClientPermissionListType",
          "documentation":"<p>The writeable attributes.</p>"
        },
        "ExplicitAuthFlows":{
          "shape":"ExplicitAuthFlowsListType",
          "documentation":"<p>The explicit authentication flows.</p>"
        },
        "SupportedIdentityProviders":{"shape":"SupportedIdentityProvidersListType"},
        "CallbackURLs":{"shape":"CallbackURLsListType"},
        "LogoutURLs":{"shape":"LogoutURLsListType"},
        "DefaultRedirectURI":{"shape":"RedirectUrlType"},
        "AllowedOAuthFlows":{"shape":"OAuthFlowsType"},
        "AllowedOAuthScopes":{"shape":"ScopeListType"},
        "AllowedOAuthFlowsUserPoolClient":{
          "shape":"BooleanType",
          "box":true
        },
        "AnalyticsConfiguration":{"shape":"AnalyticsConfigurationType"}
      },
      "documentation":"<p>A user pool of the client type.</p>"
    },
    "UserPoolDescriptionType":{
      "type":"structure",
      "members":{
        "Id":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The ID in a user pool description.</p>"
        },
        "Name":{
          "shape":"UserPoolNameType",
          "documentation":"<p>The name in a user pool description.</p>"
        },
        "LambdaConfig":{
          "shape":"LambdaConfigType",
          "documentation":"<p>The AWS Lambda configuration information in a user pool description.</p>"
        },
        "Status":{
          "shape":"StatusType",
          "documentation":"<p>The user pool status in a user pool description.</p>"
        },
        "LastModifiedDate":{
          "shape":"DateType",
          "documentation":"<p>The last modified date in a user pool description.</p>"
        },
        "CreationDate":{
          "shape":"DateType",
          "documentation":"<p>The creation date in a user pool description.</p>"
        }
      },
      "documentation":"<p>A user pool description.</p>"
    },
    "UserPoolIdType":{
      "type":"string",
      "max":55,
      "min":1,
      "pattern":"[\\w-]+_[0-9a-zA-Z]+"
    },
    "UserPoolListType":{
      "type":"list",
      "member":{"shape":"UserPoolDescriptionType"}
    },
    "UserPoolMfaType":{
      "type":"string",
      "enum":[
        "OFF",
        "ON",
        "OPTIONAL"
      ]
    },
    "UserPoolNameType":{
      "type":"string",
      "max":128,
      "min":1,
      "pattern":"[\\w\\s+=,.@-]+"
    },
    "UserPoolPolicyType":{
      "type":"structure",
      "members":{
        "PasswordPolicy":{
          "shape":"PasswordPolicyType",
          "documentation":"<p>A container with information about the user pool password policy.</p>"
        }
      },
      "documentation":"<p>The type of policy in a user pool.</p>"
    },
    "UserPoolTaggingException":{
      "type":"structure",
      "members":{
        "message":{"shape":"MessageType"}
      },
      "documentation":"<p>This exception gets thrown when a user pool tag cannot be set or updated.</p>",
      "exception":true
    },
    "UserPoolTagsType":{
      "type":"map",
      "key":{"shape":"StringType"},
      "value":{"shape":"StringType"}
    },
    "UserPoolType":{
      "type":"structure",
      "members":{
        "Id":{
          "shape":"UserPoolIdType",
          "documentation":"<p>The ID of the user pool.</p>"
        },
        "Name":{
          "shape":"UserPoolNameType",
          "documentation":"<p>The name of the user pool.</p>"
        },
        "Policies":{
          "shape":"UserPoolPolicyType",
          "documentation":"<p>A container describing the policies associated with a user pool.</p>"
        },
        "LambdaConfig":{
          "shape":"LambdaConfigType",
          "documentation":"<p>A container describing the AWS Lambda triggers associated with a user pool.</p>"
        },
        "Status":{
          "shape":"StatusType",
          "documentation":"<p>The status of a user pool.</p>"
        },
        "LastModifiedDate":{
          "shape":"DateType",
          "documentation":"<p>The last modified date of a user pool.</p>"
        },
        "CreationDate":{
          "shape":"DateType",
          "documentation":"<p>The creation date of a user pool.</p>"
        },
        "SchemaAttributes":{
          "shape":"SchemaAttributesListType",
          "documentation":"<p>A container with the schema attributes of a user pool.</p>"
        },
        "AutoVerifiedAttributes":{
          "shape":"VerifiedAttributesListType",
          "documentation":"<p>Specifies the attributes that are auto-verified in a user pool.</p>"
        },
        "AliasAttributes":{
          "shape":"AliasAttributesListType",
          "documentation":"<p>Specifies the attributes that are aliased in a user pool.</p>"
        },
        "UsernameAttributes":{"shape":"UsernameAttributesListType"},
        "SmsVerificationMessage":{
          "shape":"SmsVerificationMessageType",
          "documentation":"<p>The contents of the SMS verification message.</p>"
        },
        "EmailVerificationMessage":{
          "shape":"EmailVerificationMessageType",
          "documentation":"<p>The contents of the email verification message.</p>"
        },
        "EmailVerificationSubject":{
          "shape":"EmailVerificationSubjectType",
          "documentation":"<p>The subject of the email verification message.</p>"
        },
        "VerificationMessageTemplate":{"shape":"VerificationMessageTemplateType"},
        "SmsAuthenticationMessage":{
          "shape":"SmsVerificationMessageType",
          "documentation":"<p>The contents of the SMS authentication message.</p>"
        },
        "MfaConfiguration":{
          "shape":"UserPoolMfaType",
          "documentation":"<p>Can be one of the following values:</p> <ul> <li> <p> <code>OFF</code> - MFA tokens are not required and cannot be specified during user registration.</p> </li> <li> <p> <code>ON</code> - MFA tokens are required for all user registrations. You can only specify required when you are initially creating a user pool.</p> </li> <li> <p> <code>OPTIONAL</code> - Users have the option when registering to create an MFA token.</p> </li> </ul>"
        },
        "DeviceConfiguration":{
          "shape":"DeviceConfigurationType",
          "documentation":"<p>The device configuration.</p>"
        },
        "EstimatedNumberOfUsers":{
          "shape":"IntegerType",
          "documentation":"<p>A number estimating the size of the user pool.</p>"
        },
        "EmailConfiguration":{
          "shape":"EmailConfigurationType",
          "documentation":"<p>The email configuration.</p>"
        },
        "SmsConfiguration":{
          "shape":"SmsConfigurationType",
          "documentation":"<p>The SMS configuration.</p>"
        },
        "UserPoolTags":{
          "shape":"UserPoolTagsType",
          "documentation":"<p>The cost allocation tags for the user pool. For more information, see <a href=\"http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-cost-allocation-tagging.html\">Adding Cost Allocation Tags to Your User Pool</a> </p>"
        },
        "SmsConfigurationFailure":{
          "shape":"StringType",
          "documentation":"<p>The reason why the SMS configuration cannot send the message(s) to your users.</p>"
        },
        "EmailConfigurationFailure":{
          "shape":"StringType",
          "documentation":"<p>The reason why the email configuration cannot send the messages to your users.</p>"
        },
        "AdminCreateUserConfig":{
          "shape":"AdminCreateUserConfigType",
          "documentation":"<p>The configuration for AdminCreateUser requests.</p>"
        },
        "UserPoolAddOns":{"shape":"UserPoolAddOnsType"}
      },
      "documentation":"<p>A container with information about the user pool type.</p>"
    },
    "UserPoolUIConfigurationType":{
      "type":"structure",
      "members":{
        "UserPoolId":{"shape":"UserPoolIdType"},
        "Details":{"shape":"UserPoolUIDetailsType"},
        "LastModifiedDate":{"shape":"DateType"},
        "CreationDate":{"shape":"DateType"}
      }
    },
    "UserPoolUIDetailsType":{
      "type":"map",
      "key":{"shape":"StringType"},
      "value":{"shape":"UIDetailsMapType"}
    },
    "UserStatusType":{
      "type":"string",
      "enum":[
        "UNCONFIRMED",
        "CONFIRMED",
        "ARCHIVED",
        "COMPROMISED",
        "UNKNOWN",
        "RESET_REQUIRED",
        "FORCE_CHANGE_PASSWORD"
      ]
    },
    "UserType":{
      "type":"structure",
      "members":{
        "Username":{
          "shape":"UsernameType",
          "documentation":"<p>The user name of the user you wish to describe.</p>"
        },
        "Attributes":{
          "shape":"AttributeListType",
          "documentation":"<p>A container with information about the user type attributes.</p>"
        },
        "UserCreateDate":{
          "shape":"DateType",
          "documentation":"<p>The creation date of the user.</p>"
        },
        "UserLastModifiedDate":{
          "shape":"DateType",
          "documentation":"<p>The last modified date of the user.</p>"
        },
        "Enabled":{
          "shape":"BooleanType",
          "documentation":"<p>Specifies whether the user is enabled.</p>"
        },
        "UserStatus":{
          "shape":"UserStatusType",
          "documentation":"<p>The user status. Can be one of the following:</p> <ul> <li> <p>UNCONFIRMED - User has been created but not confirmed.</p> </li> <li> <p>CONFIRMED - User has been confirmed.</p> </li> <li> <p>ARCHIVED - User is no longer active.</p> </li> <li> <p>COMPROMISED - User is disabled due to a potential security threat.</p> </li> <li> <p>UNKNOWN - User status is not known.</p> </li> </ul>"
        },
        "MFAOptions":{
          "shape":"MFAOptionListType",
          "documentation":"<p>The MFA options for the user.</p>"
        }
      },
      "documentation":"<p>The user type.</p>"
    },
    "UsernameAttributeType":{
      "type":"string",
      "enum":[
        "phone_number",
        "email"
      ]
    },
    "UsernameAttributesListType":{
      "type":"list",
      "member":{"shape":"UsernameAttributeType"}
    },
    "UsernameExistsException":{
      "type":"structure",
      "members":{
        "message":{
          "shape":"MessageType",
          "documentation":"<p>The message returned when Amazon Cognito throws a user name exists exception.</p>"
        }
      },
      "documentation":"<p>This exception is thrown when Amazon Cognito encounters a user name that already exists in the user pool.</p>",
      "exception":true
    },
    "UsernameType":{
      "type":"string",
      "max":128,
      "min":1,
      "pattern":"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+",
      "sensitive":true
    },
    "UsersListType":{
      "type":"list",
      "member":{"shape":"UserType"}
    },
    "VerificationMessageTemplateType":{
      "type":"structure",
      "members":{
        "SmsMessage":{"shape":"SmsVerificationMessageType"},
        "EmailMessage":{"shape":"EmailVerificationMessageType"},
        "EmailSubject":{"shape":"EmailVerificationSubjectType"},
        "EmailMessageByLink":{"shape":"EmailVerificationMessageByLinkType"},
        "EmailSubjectByLink":{"shape":"EmailVerificationSubjectByLinkType"},
        "DefaultEmailOption":{"shape":"DefaultEmailOptionType"}
      }
    },
    "VerifiedAttributeType":{
      "type":"string",
      "enum":[
        "phone_number",
        "email"
      ]
    },
    "VerifiedAttributesListType":{
      "type":"list",
      "member":{"shape":"VerifiedAttributeType"}
    },
    "VerifySoftwareTokenRequest":{
      "type":"structure",
      "required":["UserCode"],
      "members":{
        "AccessToken":{"shape":"TokenModelType"},
        "Session":{"shape":"SessionType"},
        "UserCode":{"shape":"SoftwareTokenMFAUserCodeType"},
        "FriendlyDeviceName":{"shape":"StringType"}
      }
    },
    "VerifySoftwareTokenResponse":{
      "type":"structure",
      "members":{
        "Status":{"shape":"VerifySoftwareTokenResponseType"},
        "Session":{"shape":"SessionType"}
      }
    },
    "VerifySoftwareTokenResponseType":{
      "type":"string",
      "enum":[
        "SUCCESS",
        "ERROR"
      ]
    },
    "VerifyUserAttributeRequest":{
      "type":"structure",
      "required":[
        "AccessToken",
        "AttributeName",
        "Code"
      ],
      "members":{
        "AccessToken":{
          "shape":"TokenModelType",
          "documentation":"<p>Represents the access token of the request to verify user attributes.</p>"
        },
        "AttributeName":{
          "shape":"AttributeNameType",
          "documentation":"<p>The attribute name in the request to verify user attributes.</p>"
        },
        "Code":{
          "shape":"ConfirmationCodeType",
          "documentation":"<p>The verification code in the request to verify user attributes.</p>"
        }
      },
      "documentation":"<p>Represents the request to verify user attributes.</p>"
    },
    "VerifyUserAttributeResponse":{
      "type":"structure",
      "members":{
      },
      "documentation":"<p>A container representing the response from the server from the request to verify user attributes.</p>"
    },
    "openIdListType":{
      "type":"list",
      "member":{"shape":"StringType"}
    },
    "openIdUrlType":{
      "type":"string",
      "max":150,
      "min":1,
      "pattern":"https://cognito-idp\\.amazonaws\\.com/[\\w\\._/-]"
    }
  },
  "documentation":"<p>Using the Amazon Cognito Your User Pools API, you can create a user pool to manage directories and users. You can authenticate a user to obtain tokens related to user identity and access policies.</p> <p>This API reference provides information about user pools in Amazon Cognito Your User Pools.</p> <p>For more information, see the Amazon Cognito Documentation.</p>"
}
},{}],3:[function(require,module,exports){
module.exports={
  "acm": {
    "name": "ACM",
    "cors": true
  },
  "apigateway": {
    "name": "APIGateway",
    "cors": true
  },
  "applicationautoscaling": {
    "prefix": "application-autoscaling",
    "name": "ApplicationAutoScaling",
    "cors": true
  },
  "autoscaling": {
    "name": "AutoScaling",
    "cors": true
  },
  "cloudformation": {
    "name": "CloudFormation",
    "cors": true
  },
  "cloudfront": {
    "name": "CloudFront",
    "versions": ["2013-05-12*", "2013-11-11*", "2014-05-31*", "2014-10-21*", "2014-11-06*", "2015-04-17*", "2015-07-27*", "2015-09-17*", "2016-01-13*", "2016-01-28*", "2016-08-01*", "2016-08-20*"],
    "cors": true
  },
  "cloudhsm": {
    "name": "CloudHSM",
    "cors": true
  },
  "cloudsearch": {
    "name": "CloudSearch"
  },
  "cloudsearchdomain": {
    "name": "CloudSearchDomain"
  },
  "cloudtrail": {
    "name": "CloudTrail",
    "cors": true
  },
  "cloudwatch": {
    "prefix": "monitoring",
    "name": "CloudWatch",
    "cors": true
  },
  "cloudwatchevents": {
    "prefix": "events",
    "name": "CloudWatchEvents",
    "versions": ["2014-02-03*"],
    "cors": true
  },
  "cloudwatchlogs": {
    "prefix": "logs",
    "name": "CloudWatchLogs",
    "cors": true
  },
  "codecommit": {
    "name": "CodeCommit",
    "cors": true
  },
  "codedeploy": {
    "name": "CodeDeploy",
    "cors": true
  },
  "codepipeline": {
    "name": "CodePipeline",
    "cors": true
  },
  "cognitoidentity": {
    "prefix": "cognito-identity",
    "name": "CognitoIdentity",
    "cors": true
  },
  "cognitoidentityserviceprovider": {
    "prefix": "cognito-idp",
    "name": "CognitoIdentityServiceProvider",
    "cors": true
  },
  "cognitosync": {
    "prefix": "cognito-sync",
    "name": "CognitoSync",
    "cors": true
  },
  "configservice": {
    "prefix": "config",
    "name": "ConfigService",
    "cors": true
  },
  "datapipeline": {
    "name": "DataPipeline"
  },
  "devicefarm": {
    "name": "DeviceFarm",
    "cors": true
  },
  "directconnect": {
    "name": "DirectConnect",
    "cors": true
  },
  "directoryservice": {
    "prefix": "ds",
    "name": "DirectoryService"
  },
  "discovery": {
    "name": "Discovery"
  },
  "dms": {
    "name": "DMS"
  },
  "dynamodb": {
    "name": "DynamoDB",
    "cors": true
  },
  "dynamodbstreams": {
    "prefix": "streams.dynamodb",
    "name": "DynamoDBStreams",
    "cors": true
  },
  "ec2": {
    "name": "EC2",
    "versions": ["2013-06-15*", "2013-10-15*", "2014-02-01*", "2014-05-01*", "2014-06-15*", "2014-09-01*", "2014-10-01*", "2015-03-01*", "2015-04-15*", "2015-10-01*"],
    "cors": true
  },
  "ecr": {
    "name": "ECR",
    "cors": true
  },
  "ecs": {
    "name": "ECS",
    "cors": true
  },
  "efs": {
    "prefix": "elasticfilesystem",
    "name": "EFS"
  },
  "elasticache": {
    "name": "ElastiCache",
    "versions": ["2012-11-15*", "2014-03-24*", "2014-07-15*", "2014-09-30*"],
    "cors": true
  },
  "elasticbeanstalk": {
    "name": "ElasticBeanstalk",
    "cors": true
  },
  "elb": {
    "prefix": "elasticloadbalancing",
    "name": "ELB",
    "cors": true
  },
  "elbv2": {
    "prefix": "elasticloadbalancingv2",
    "name": "ELBv2",
    "cors": true
  },
  "emr": {
    "prefix": "elasticmapreduce",
    "name": "EMR",
    "cors": true
  },
  "es": {
    "name": "ES"
  },
  "elastictranscoder": {
    "name": "ElasticTranscoder",
    "cors": true
  },
  "firehose": {
    "name": "Firehose",
    "cors": true
  },
  "gamelift": {
    "name": "GameLift",
    "cors": true
  },
  "glacier": {
    "name": "Glacier"
  },
  "iam": {
    "name": "IAM"
  },
  "importexport": {
    "name": "ImportExport"
  },
  "inspector": {
    "name": "Inspector",
    "versions": ["2015-08-18*"],
    "cors": true
  },
  "iot": {
    "name": "Iot",
    "cors": true
  },
  "iotdata": {
    "prefix": "iot-data",
    "name": "IotData",
    "cors": true
  },
  "kinesis": {
    "name": "Kinesis",
    "cors": true
  },
  "kinesisanalytics": {
    "name": "KinesisAnalytics"
  },
  "kms": {
    "name": "KMS",
    "cors": true
  },
  "lambda": {
    "name": "Lambda",
    "cors": true
  },
  "machinelearning": {
    "name": "MachineLearning",
    "cors": true
  },
  "marketplacecommerceanalytics": {
    "name": "MarketplaceCommerceAnalytics",
    "cors": true
  },
  "marketplacemetering": {
      "prefix": "meteringmarketplace",
      "name": "MarketplaceMetering"
  },
  "mobileanalytics": {
    "name": "MobileAnalytics",
    "cors": true
  },
  "opsworks": {
    "name": "OpsWorks",
    "cors": true
  },
  "rds": {
    "name": "RDS",
    "versions": ["2014-09-01*"],
    "cors": true
  },
  "redshift": {
    "name": "Redshift",
    "cors": true
  },
  "route53": {
    "name": "Route53",
    "cors": true
  },
  "route53domains": {
    "name": "Route53Domains",
    "cors": true
  },
  "s3": {
    "name": "S3",
    "dualstackAvailable": true,
    "cors": true
  },
  "servicecatalog": {
    "name": "ServiceCatalog",
    "cors": true
  },
  "ses": {
    "prefix": "email",
    "name": "SES",
    "cors": true
  },
  "simpledb": {
    "prefix": "sdb",
    "name": "SimpleDB"
  },
  "snowball": {
    "name": "Snowball"
  },
  "sns": {
    "name": "SNS",
    "cors": true
  },
  "sqs": {
    "name": "SQS",
    "cors": true
  },
  "ssm": {
    "name": "SSM",
    "cors": true
  },
  "storagegateway": {
    "name": "StorageGateway",
    "cors": true
  },
  "sts": {
    "name": "STS",
    "cors": true
  },
  "support": {
    "name": "Support"
  },
  "swf": {
    "name": "SWF"
  },
  "waf": {
    "name": "WAF",
    "cors": true
  },
  "workspaces": {
    "name": "WorkSpaces"
  }
}

},{}],4:[function(require,module,exports){
module.exports={
  "version": "2.0",
  "metadata": {
    "apiVersion": "2011-06-15",
    "endpointPrefix": "sts",
    "globalEndpoint": "sts.amazonaws.com",
    "protocol": "query",
    "serviceAbbreviation": "AWS STS",
    "serviceFullName": "AWS Security Token Service",
    "signatureVersion": "v4",
    "xmlNamespace": "https://sts.amazonaws.com/doc/2011-06-15/"
  },
  "operations": {
    "AssumeRole": {
      "input": {
        "type": "structure",
        "required": [
          "RoleArn",
          "RoleSessionName"
        ],
        "members": {
          "RoleArn": {},
          "RoleSessionName": {},
          "Policy": {},
          "DurationSeconds": {
            "type": "integer"
          },
          "ExternalId": {},
          "SerialNumber": {},
          "TokenCode": {}
        }
      },
      "output": {
        "resultWrapper": "AssumeRoleResult",
        "type": "structure",
        "members": {
          "Credentials": {
            "shape": "Sa"
          },
          "AssumedRoleUser": {
            "shape": "Sf"
          },
          "PackedPolicySize": {
            "type": "integer"
          }
        }
      }
    },
    "AssumeRoleWithSAML": {
      "input": {
        "type": "structure",
        "required": [
          "RoleArn",
          "PrincipalArn",
          "SAMLAssertion"
        ],
        "members": {
          "RoleArn": {},
          "PrincipalArn": {},
          "SAMLAssertion": {},
          "Policy": {},
          "DurationSeconds": {
            "type": "integer"
          }
        }
      },
      "output": {
        "resultWrapper": "AssumeRoleWithSAMLResult",
        "type": "structure",
        "members": {
          "Credentials": {
            "shape": "Sa"
          },
          "AssumedRoleUser": {
            "shape": "Sf"
          },
          "PackedPolicySize": {
            "type": "integer"
          },
          "Subject": {},
          "SubjectType": {},
          "Issuer": {},
          "Audience": {},
          "NameQualifier": {}
        }
      }
    },
    "AssumeRoleWithWebIdentity": {
      "input": {
        "type": "structure",
        "required": [
          "RoleArn",
          "RoleSessionName",
          "WebIdentityToken"
        ],
        "members": {
          "RoleArn": {},
          "RoleSessionName": {},
          "WebIdentityToken": {},
          "ProviderId": {},
          "Policy": {},
          "DurationSeconds": {
            "type": "integer"
          }
        }
      },
      "output": {
        "resultWrapper": "AssumeRoleWithWebIdentityResult",
        "type": "structure",
        "members": {
          "Credentials": {
            "shape": "Sa"
          },
          "SubjectFromWebIdentityToken": {},
          "AssumedRoleUser": {
            "shape": "Sf"
          },
          "PackedPolicySize": {
            "type": "integer"
          },
          "Provider": {},
          "Audience": {}
        }
      }
    },
    "DecodeAuthorizationMessage": {
      "input": {
        "type": "structure",
        "required": [
          "EncodedMessage"
        ],
        "members": {
          "EncodedMessage": {}
        }
      },
      "output": {
        "resultWrapper": "DecodeAuthorizationMessageResult",
        "type": "structure",
        "members": {
          "DecodedMessage": {}
        }
      }
    },
    "GetCallerIdentity": {
      "input": {
        "type": "structure",
        "members": {}
      },
      "output": {
        "resultWrapper": "GetCallerIdentityResult",
        "type": "structure",
        "members": {
          "UserId": {},
          "Account": {},
          "Arn": {}
        }
      }
    },
    "GetFederationToken": {
      "input": {
        "type": "structure",
        "required": [
          "Name"
        ],
        "members": {
          "Name": {},
          "Policy": {},
          "DurationSeconds": {
            "type": "integer"
          }
        }
      },
      "output": {
        "resultWrapper": "GetFederationTokenResult",
        "type": "structure",
        "members": {
          "Credentials": {
            "shape": "Sa"
          },
          "FederatedUser": {
            "type": "structure",
            "required": [
              "FederatedUserId",
              "Arn"
            ],
            "members": {
              "FederatedUserId": {},
              "Arn": {}
            }
          },
          "PackedPolicySize": {
            "type": "integer"
          }
        }
      }
    },
    "GetSessionToken": {
      "input": {
        "type": "structure",
        "members": {
          "DurationSeconds": {
            "type": "integer"
          },
          "SerialNumber": {},
          "TokenCode": {}
        }
      },
      "output": {
        "resultWrapper": "GetSessionTokenResult",
        "type": "structure",
        "members": {
          "Credentials": {
            "shape": "Sa"
          }
        }
      }
    }
  },
  "shapes": {
    "Sa": {
      "type": "structure",
      "required": [
        "AccessKeyId",
        "SecretAccessKey",
        "SessionToken",
        "Expiration"
      ],
      "members": {
        "AccessKeyId": {},
        "SecretAccessKey": {},
        "SessionToken": {},
        "Expiration": {
          "type": "timestamp"
        }
      }
    },
    "Sf": {
      "type": "structure",
      "required": [
        "AssumedRoleId",
        "Arn"
      ],
      "members": {
        "AssumedRoleId": {},
        "Arn": {}
      }
    }
  }
}
},{}],5:[function(require,module,exports){
require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = require('../lib/service');
var apiLoader = require('../lib/api_loader');

apiLoader.services['cognitoidentity'] = {};
AWS.CognitoIdentity = Service.defineService('cognitoidentity', ['2014-06-30']);
require('../lib/services/cognitoidentity');
Object.defineProperty(apiLoader.services['cognitoidentity'], '2014-06-30', {
  get: function get() {
    var model = require('../apis/cognito-identity-2014-06-30.min.json');
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CognitoIdentity;

},{"../apis/cognito-identity-2014-06-30.min.json":1,"../lib/api_loader":7,"../lib/core":11,"../lib/node_loader":9,"../lib/service":42,"../lib/services/cognitoidentity":43}],6:[function(require,module,exports){
require('../lib/node_loader');
var AWS = require('../lib/core');
var Service = require('../lib/service');
var apiLoader = require('../lib/api_loader');

apiLoader.services['sts'] = {};
AWS.STS = Service.defineService('sts', ['2011-06-15']);
require('../lib/services/sts');
Object.defineProperty(apiLoader.services['sts'], '2011-06-15', {
  get: function get() {
    var model = require('../apis/sts-2011-06-15.min.json');
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.STS;

},{"../apis/sts-2011-06-15.min.json":4,"../lib/api_loader":7,"../lib/core":11,"../lib/node_loader":9,"../lib/service":42,"../lib/services/sts":44}],7:[function(require,module,exports){
var AWS = require('./core');

AWS.apiLoader = function(svc, version) {
  if (!AWS.apiLoader.services.hasOwnProperty(svc)) {
    throw new Error('InvalidService: Failed to load api for ' + svc);
  }
  return AWS.apiLoader.services[svc][version];
};

AWS.apiLoader.services = {};

module.exports = AWS.apiLoader;
},{"./core":11}],8:[function(require,module,exports){
require('./browser_loader');

var AWS = require('./core');

if (typeof window !== 'undefined') window.AWSCognito = AWS;
if (typeof module !== 'undefined') module.exports = AWS;
if (typeof self !== 'undefined') self.AWSCognito = AWS;

if (!Object.prototype.hasOwnProperty.call(AWS, 'CognitoIdentityServiceProvider')) {
  AWS.apiLoader.services['cognitoidentityserviceprovider'] = {};
  AWS.CognitoIdentityServiceProvider = AWS.Service.defineService('cognitoidentityserviceprovider', [ '2016-04-18' ]);
}
AWS.apiLoader.services['cognitoidentityserviceprovider']['2016-04-18'] = require('../apis/cognito-idp-2016-04-18.min');

if (!Object.prototype.hasOwnProperty.call(AWS, 'STS')) {
  AWS.apiLoader.services['sts'] = {};
  AWS.STS = AWS.Service.defineService('sts', [ '2011-06-15' ]);
  require('./services/sts');
}
AWS.apiLoader.services['sts']['2011-06-15'] = require('../apis/sts-2011-06-15.min');


},{"../apis/cognito-idp-2016-04-18.min":2,"../apis/sts-2011-06-15.min":4,"./browser_loader":9,"./core":11,"./services/sts":44}],9:[function(require,module,exports){
(function (process){
var util = require('./util');

util.crypto.lib = require('crypto-browserify');
util.Buffer = require('buffer/').Buffer;
util.url = require('url/');
util.querystring = require('querystring/');

var AWS = require('./core');

require('./api_loader');

AWS.XML.Parser = require('./xml/browser_parser');

require('./http/xhr');

if (typeof process === 'undefined') {
  process = {
    browser: true
  };
}
}).call(this,require("FWaASH"))
},{"./api_loader":7,"./core":11,"./http/xhr":20,"./util":53,"./xml/browser_parser":54,"FWaASH":62,"buffer/":69,"crypto-browserify":74,"querystring/":82,"url/":83}],10:[function(require,module,exports){
var AWS = require('./core');
require('./credentials');
require('./credentials/credential_provider_chain');


AWS.Config = AWS.util.inherit({



  constructor: function Config(options) {
    if (options === undefined) options = {};
    options = this.extractCredentials(options);

    AWS.util.each.call(this, this.keys, function (key, value) {
      this.set(key, options[key], value);
    });
  },




  getCredentials: function getCredentials(callback) {
    var self = this;

    function finish(err) {
      callback(err, err ? null : self.credentials);
    }

    function credError(msg, err) {
      return new AWS.util.error(err || new Error(), {
        code: 'CredentialsError', message: msg
      });
    }

    function getAsyncCredentials() {
      self.credentials.get(function(err) {
        if (err) {
          var msg = 'Could not load credentials from ' +
            self.credentials.constructor.name;
          err = credError(msg, err);
        }
        finish(err);
      });
    }

    function getStaticCredentials() {
      var err = null;
      if (!self.credentials.accessKeyId || !self.credentials.secretAccessKey) {
        err = credError('Missing credentials');
      }
      finish(err);
    }

    if (self.credentials) {
      if (typeof self.credentials.get === 'function') {
        getAsyncCredentials();
      } else { // static credentials
        getStaticCredentials();
      }
    } else if (self.credentialProvider) {
      self.credentialProvider.resolve(function(err, creds) {
        if (err) {
          err = credError('Could not load credentials from any providers', err);
        }
        self.credentials = creds;
        finish(err);
      });
    } else {
      finish(credError('No credentials to load'));
    }
  },




  update: function update(options, allowUnknownKeys) {
    allowUnknownKeys = allowUnknownKeys || false;
    options = this.extractCredentials(options);
    AWS.util.each.call(this, options, function (key, value) {
      if (allowUnknownKeys || Object.prototype.hasOwnProperty.call(this.keys, key) ||
          AWS.Service.hasService(key)) {
        this.set(key, value);
      }
    });
  },


  loadFromPath: function loadFromPath(path) {
    this.clear();

    var options = JSON.parse(AWS.util.readFileSync(path));
    var fileSystemCreds = new AWS.FileSystemCredentials(path);
    var chain = new AWS.CredentialProviderChain();
    chain.providers.unshift(fileSystemCreds);
    chain.resolve(function (err, creds) {
      if (err) throw err;
      else options.credentials = creds;
    });

    this.constructor(options);

    return this;
  },


  clear: function clear() {

    AWS.util.each.call(this, this.keys, function (key) {
      delete this[key];
    });

    this.set('credentials', undefined);
    this.set('credentialProvider', undefined);
  },


  set: function set(property, value, defaultValue) {
    if (value === undefined) {
      if (defaultValue === undefined) {
        defaultValue = this.keys[property];
      }
      if (typeof defaultValue === 'function') {
        this[property] = defaultValue.call(this);
      } else {
        this[property] = defaultValue;
      }
    } else if (property === 'httpOptions' && this[property]) {
      this[property] = AWS.util.merge(this[property], value);
    } else {
      this[property] = value;
    }
  },


  keys: {
    credentials: null,
    credentialProvider: null,
    region: null,
    logger: null,
    apiVersions: {},
    apiVersion: null,
    endpoint: undefined,
    httpOptions: {
      timeout: 120000
    },
    maxRetries: undefined,
    maxRedirects: 10,
    paramValidation: true,
    sslEnabled: true,
    s3ForcePathStyle: false,
    s3BucketEndpoint: false,
    s3DisableBodySigning: true,
    computeChecksums: true,
    convertResponseTypes: true,
    correctClockSkew: false,
    customUserAgent: null,
    dynamoDbCrc32: true,
    systemClockOffset: 0,
    signatureVersion: null,
    signatureCache: true,
    retryDelayOptions: {
      base: 100
    },
    useAccelerateEndpoint: false
  },


  extractCredentials: function extractCredentials(options) {
    if (options.accessKeyId && options.secretAccessKey) {
      options = AWS.util.copy(options);
      options.credentials = new AWS.Credentials(options);
    }
    return options;
  },


  setPromisesDependency: function setPromisesDependency(dep) {
    AWS.util.addPromisesToRequests(AWS.Request, dep);
  }
});


AWS.config = new AWS.Config();

},{"./core":11,"./credentials":12,"./credentials/credential_provider_chain":14}],11:[function(require,module,exports){

var AWS = { util: require('./util') };


var _hidden = {}; _hidden.toString(); // hack to parse macro

module.exports = AWS;

AWS.util.update(AWS, {


  VERSION: '2.6.4',


  Signers: {},


  Protocol: {
    Json: require('./protocol/json'),
    Query: require('./protocol/query'),
    Rest: require('./protocol/rest'),
    RestJson: require('./protocol/rest_json'),
    RestXml: require('./protocol/rest_xml')
  },


  XML: {
    Builder: require('./xml/builder'),
    Parser: null // conditionally set based on environment
  },


  JSON: {
    Builder: require('./json/builder'),
    Parser: require('./json/parser')
  },


  Model: {
    Api: require('./model/api'),
    Operation: require('./model/operation'),
    Shape: require('./model/shape'),
    Paginator: require('./model/paginator'),
    ResourceWaiter: require('./model/resource_waiter')
  },

  util: require('./util'),


  apiLoader: function() { throw new Error('No API loader set'); }
});

require('./service');

require('./credentials');
require('./credentials/credential_provider_chain');
require('./credentials/temporary_credentials');
require('./credentials/web_identity_credentials');
require('./credentials/cognito_identity_credentials');
require('./credentials/saml_credentials');

require('./config');
require('./http');
require('./sequential_executor');
require('./event_listeners');
require('./request');
require('./response');
require('./resource_waiter');
require('./signers/request_signer');
require('./param_validator');


AWS.events = new AWS.SequentialExecutor();

},{"./config":10,"./credentials":12,"./credentials/cognito_identity_credentials":13,"./credentials/credential_provider_chain":14,"./credentials/saml_credentials":15,"./credentials/temporary_credentials":16,"./credentials/web_identity_credentials":17,"./event_listeners":18,"./http":19,"./json/builder":21,"./json/parser":22,"./model/api":23,"./model/operation":25,"./model/paginator":26,"./model/resource_waiter":27,"./model/shape":28,"./param_validator":29,"./protocol/json":30,"./protocol/query":31,"./protocol/rest":32,"./protocol/rest_json":33,"./protocol/rest_xml":34,"./request":38,"./resource_waiter":39,"./response":40,"./sequential_executor":41,"./service":42,"./signers/request_signer":46,"./util":53,"./xml/builder":55}],12:[function(require,module,exports){
var AWS = require('./core');


AWS.Credentials = AWS.util.inherit({

  constructor: function Credentials() {
    AWS.util.hideProperties(this, ['secretAccessKey']);

    this.expired = false;
    this.expireTime = null;
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
      var creds = arguments[0].credentials || arguments[0];
      this.accessKeyId = creds.accessKeyId;
      this.secretAccessKey = creds.secretAccessKey;
      this.sessionToken = creds.sessionToken;
    } else {
      this.accessKeyId = arguments[0];
      this.secretAccessKey = arguments[1];
      this.sessionToken = arguments[2];
    }
  },


  expiryWindow: 15,


  needsRefresh: function needsRefresh() {
    var currentTime = AWS.util.date.getDate().getTime();
    var adjustedTime = new Date(currentTime + this.expiryWindow * 1000);

    if (this.expireTime && adjustedTime > this.expireTime) {
      return true;
    } else {
      return this.expired || !this.accessKeyId || !this.secretAccessKey;
    }
  },


  get: function get(callback) {
    var self = this;
    if (this.needsRefresh()) {
      this.refresh(function(err) {
        if (!err) self.expired = false; // reset expired flag
        if (callback) callback(err);
      });
    } else if (callback) {
      callback();
    }
  },


  refresh: function refresh(callback) {
    this.expired = false;
    callback();
  }
});

},{"./core":11}],13:[function(require,module,exports){
var AWS = require('../core');
var CognitoIdentity = require('../../clients/cognitoidentity');
var STS = require('../../clients/sts');


AWS.CognitoIdentityCredentials = AWS.util.inherit(AWS.Credentials, {

  localStorageKey: {
    id: 'aws.cognito.identity-id.',
    providers: 'aws.cognito.identity-providers.'
  },


  constructor: function CognitoIdentityCredentials(params) {
    AWS.Credentials.call(this);
    this.expired = true;
    this.params = params;
    this.data = null;
    this.identityId = null;
    this.loadCachedId();
  },


  refresh: function refresh(callback) {
    var self = this;
    self.createClients();
    self.data = null;
    self.identityId = null;
    self.getId(function(err) {
      if (!err) {
        if (!self.params.RoleArn) {
          self.getCredentialsForIdentity(callback);
        } else {
          self.getCredentialsFromSTS(callback);
        }
      } else {
        self.clearIdOnNotAuthorized(err);
        callback(err);
      }
    });
  },


  clearCachedId: function clearCache() {
    this.identityId = null;
    delete this.params.IdentityId;

    var poolId = this.params.IdentityPoolId;
    var loginId = this.params.LoginId || '';
    delete this.storage[this.localStorageKey.id + poolId + loginId];
    delete this.storage[this.localStorageKey.providers + poolId + loginId];
  },


  clearIdOnNotAuthorized: function clearIdOnNotAuthorized(err) {
    var self = this;
    if (err.code == 'NotAuthorizedException') {
      self.clearCachedId();
    }
  },


  getId: function getId(callback) {
    var self = this;
    if (typeof self.params.IdentityId === 'string') {
      return callback(null, self.params.IdentityId);
    }

    self.cognito.getId(function(err, data) {
      if (!err && data.IdentityId) {
        self.params.IdentityId = data.IdentityId;
        callback(null, data.IdentityId);
      } else {
        callback(err);
      }
    });
  },



  loadCredentials: function loadCredentials(data, credentials) {
    if (!data || !credentials) return;
    credentials.expired = false;
    credentials.accessKeyId = data.Credentials.AccessKeyId;
    credentials.secretAccessKey = data.Credentials.SecretKey;
    credentials.sessionToken = data.Credentials.SessionToken;
    credentials.expireTime = data.Credentials.Expiration;
  },


  getCredentialsForIdentity: function getCredentialsForIdentity(callback) {
    var self = this;
    self.cognito.getCredentialsForIdentity(function(err, data) {
      if (!err) {
        self.cacheId(data);
        self.data = data;
        self.loadCredentials(self.data, self);
      } else {
        self.clearIdOnNotAuthorized(err);
      }
      callback(err);
    });
  },


  getCredentialsFromSTS: function getCredentialsFromSTS(callback) {
    var self = this;
    self.cognito.getOpenIdToken(function(err, data) {
      if (!err) {
        self.cacheId(data);
        self.params.WebIdentityToken = data.Token;
        self.webIdentityCredentials.refresh(function(webErr) {
          if (!webErr) {
            self.data = self.webIdentityCredentials.data;
            self.sts.credentialsFrom(self.data, self);
          }
          callback(webErr);
        });
      } else {
        self.clearIdOnNotAuthorized(err);
        callback(err);
      }
    });
  },


  loadCachedId: function loadCachedId() {
    var self = this;

    if (AWS.util.isBrowser() && !self.params.IdentityId) {
      var id = self.getStorage('id');
      if (id && self.params.Logins) {
        var actualProviders = Object.keys(self.params.Logins);
        var cachedProviders =
          (self.getStorage('providers') || '').split(',');

        var intersect = cachedProviders.filter(function(n) {
          return actualProviders.indexOf(n) !== -1;
        });
        if (intersect.length !== 0) {
          self.params.IdentityId = id;
        }
      } else if (id) {
        self.params.IdentityId = id;
      }
    }
  },


  createClients: function() {
    this.webIdentityCredentials = this.webIdentityCredentials ||
      new AWS.WebIdentityCredentials(this.params);
    this.cognito = this.cognito ||
      new CognitoIdentity({params: this.params});
    this.sts = this.sts || new STS();
  },


  cacheId: function cacheId(data) {
    this.identityId = data.IdentityId;
    this.params.IdentityId = this.identityId;

    if (AWS.util.isBrowser()) {
      this.setStorage('id', data.IdentityId);

      if (this.params.Logins) {
        this.setStorage('providers', Object.keys(this.params.Logins).join(','));
      }
    }
  },


  getStorage: function getStorage(key) {
    return this.storage[this.localStorageKey[key] + this.params.IdentityPoolId + (this.params.LoginId || '')];
  },


  setStorage: function setStorage(key, val) {
    try {
      this.storage[this.localStorageKey[key] + this.params.IdentityPoolId + (this.params.LoginId || '')] = val;
    } catch (_) {}
  },


  storage: (function() {
    try {
      window.localStorage.setItem('aws.test-storage', 'foobar');
      window.localStorage.removeItem('aws.test-storage');

      return AWS.util.isBrowser() ? window.localStorage : {};
    } catch (_) {
      return {};
    }
  })()
});

},{"../../clients/cognitoidentity":5,"../../clients/sts":6,"../core":11}],14:[function(require,module,exports){
var AWS = require('../core');


AWS.CredentialProviderChain = AWS.util.inherit(AWS.Credentials, {


  constructor: function CredentialProviderChain(providers) {
    if (providers) {
      this.providers = providers;
    } else {
      this.providers = AWS.CredentialProviderChain.defaultProviders.slice(0);
    }
  },


  resolve: function resolve(callback) {
    if (this.providers.length === 0) {
      callback(new Error('No providers'));
      return this;
    }

    var index = 0;
    var providers = this.providers.slice(0);

    function resolveNext(err, creds) {
      if ((!err && creds) || index === providers.length) {
        callback(err, creds);
        return;
      }

      var provider = providers[index++];
      if (typeof provider === 'function') {
        creds = provider.call();
      } else {
        creds = provider;
      }

      if (creds.get) {
        creds.get(function(getErr) {
          resolveNext(getErr, getErr ? null : creds);
        });
      } else {
        resolveNext(null, creds);
      }
    }

    resolveNext();
    return this;
  }

});


AWS.CredentialProviderChain.defaultProviders = [];

},{"../core":11}],15:[function(require,module,exports){
var AWS = require('../core');
var STS = require('../../clients/sts');


AWS.SAMLCredentials = AWS.util.inherit(AWS.Credentials, {

  constructor: function SAMLCredentials(params) {
    AWS.Credentials.call(this);
    this.expired = true;
    this.params = params;
  },


  refresh: function refresh(callback) {
    var self = this;
    self.createClients();
    if (!callback) callback = function(err) { if (err) throw err; };

    self.service.assumeRoleWithSAML(function (err, data) {
      if (!err) {
        self.service.credentialsFrom(data, self);
      }
      callback(err);
    });
  },


  createClients: function() {
    this.service = this.service || new STS({params: this.params});
  }

});

},{"../../clients/sts":6,"../core":11}],16:[function(require,module,exports){
var AWS = require('../core');
var STS = require('../../clients/sts');


AWS.TemporaryCredentials = AWS.util.inherit(AWS.Credentials, {

  constructor: function TemporaryCredentials(params) {
    AWS.Credentials.call(this);
    this.loadMasterCredentials();
    this.expired = true;

    this.params = params || {};
    if (this.params.RoleArn) {
      this.params.RoleSessionName =
        this.params.RoleSessionName || 'temporary-credentials';
    }
  },


  refresh: function refresh(callback) {
    var self = this;
    self.createClients();
    if (!callback) callback = function(err) { if (err) throw err; };

    self.service.config.credentials = self.masterCredentials;
    var operation = self.params.RoleArn ?
      self.service.assumeRole : self.service.getSessionToken;
    operation.call(self.service, function (err, data) {
      if (!err) {
        self.service.credentialsFrom(data, self);
      }
      callback(err);
    });
  },


  loadMasterCredentials: function loadMasterCredentials() {
    this.masterCredentials = AWS.config.credentials;
    while (this.masterCredentials.masterCredentials) {
      this.masterCredentials = this.masterCredentials.masterCredentials;
    }
  },


  createClients: function() {
    this.service = this.service || new STS({params: this.params});
  }

});

},{"../../clients/sts":6,"../core":11}],17:[function(require,module,exports){
var AWS = require('../core');
var STS = require('../../clients/sts');


AWS.WebIdentityCredentials = AWS.util.inherit(AWS.Credentials, {

  constructor: function WebIdentityCredentials(params) {
    AWS.Credentials.call(this);
    this.expired = true;
    this.params = params;
    this.params.RoleSessionName = this.params.RoleSessionName || 'web-identity';
    this.data = null;
  },


  refresh: function refresh(callback) {
    var self = this;
    self.createClients();
    if (!callback) callback = function(err) { if (err) throw err; };

    self.service.assumeRoleWithWebIdentity(function (err, data) {
      self.data = null;
      if (!err) {
        self.data = data;
        self.service.credentialsFrom(data, self);
      }
      callback(err);
    });
  },


  createClients: function() {
    this.service = this.service || new STS({params: this.params});
  }

});

},{"../../clients/sts":6,"../core":11}],18:[function(require,module,exports){
var AWS = require('./core');
var SequentialExecutor = require('./sequential_executor');


AWS.EventListeners = {

  Core: {} /* doc hack */
};

AWS.EventListeners = {
  Core: new SequentialExecutor().addNamedListeners(function(add, addAsync) {
    addAsync('VALIDATE_CREDENTIALS', 'validate',
        function VALIDATE_CREDENTIALS(req, done) {
      if (!req.service.api.signatureVersion) return done(); // none
      req.service.config.getCredentials(function(err) {
        if (err) {
          req.response.error = AWS.util.error(err,
            {code: 'CredentialsError', message: 'Missing credentials in config'});
        }
        done();
      });
    });

    add('VALIDATE_REGION', 'validate', function VALIDATE_REGION(req) {
      if (!req.service.config.region && !req.service.isGlobalEndpoint) {
        req.response.error = AWS.util.error(new Error(),
          {code: 'ConfigError', message: 'Missing region in config'});
      }
    });

    add('VALIDATE_PARAMETERS', 'validate', function VALIDATE_PARAMETERS(req) {
      var rules = req.service.api.operations[req.operation].input;
      var validation = req.service.config.paramValidation;
      new AWS.ParamValidator(validation).validate(rules, req.params);
    });

    addAsync('COMPUTE_SHA256', 'afterBuild', function COMPUTE_SHA256(req, done) {
      req.haltHandlersOnError();
      if (!req.service.api.signatureVersion) return done(); // none
      if (req.service.getSignerClass(req) === AWS.Signers.V4) {
        var body = req.httpRequest.body || '';
        AWS.util.computeSha256(body, function(err, sha) {
          if (err) {
            done(err);
          }
          else {
            req.httpRequest.headers['X-Amz-Content-Sha256'] = sha;
            done();
          }
        });
      } else {
        done();
      }
    });

    add('SET_CONTENT_LENGTH', 'afterBuild', function SET_CONTENT_LENGTH(req) {
      if (req.httpRequest.headers['Content-Length'] === undefined) {
        var length = AWS.util.string.byteLength(req.httpRequest.body);
        req.httpRequest.headers['Content-Length'] = length;
      }
    });

    add('SET_HTTP_HOST', 'afterBuild', function SET_HTTP_HOST(req) {
      req.httpRequest.headers['Host'] = req.httpRequest.endpoint.host;
    });

    add('RESTART', 'restart', function RESTART() {
      var err = this.response.error;
      if (!err || !err.retryable) return;

      this.httpRequest = new AWS.HttpRequest(
        this.service.endpoint,
        this.service.region
      );

      if (this.response.retryCount < this.service.config.maxRetries) {
        this.response.retryCount++;
      } else {
        this.response.error = null;
      }
    });

    addAsync('SIGN', 'sign', function SIGN(req, done) {
      var service = req.service;
      if (!service.api.signatureVersion) return done(); // none

      service.config.getCredentials(function (err, credentials) {
        if (err) {
          req.response.error = err;
          return done();
        }

        try {
          var date = AWS.util.date.getDate();
          var SignerClass = service.getSignerClass(req);
          var signer = new SignerClass(req.httpRequest,
            service.api.signingName || service.api.endpointPrefix,
           service.config.signatureCache);
          signer.setServiceClientId(service._clientId);

          delete req.httpRequest.headers['Authorization'];
          delete req.httpRequest.headers['Date'];
          delete req.httpRequest.headers['X-Amz-Date'];

          signer.addAuthorization(credentials, date);
          req.signedAt = date;
        } catch (e) {
          req.response.error = e;
        }
        done();
      });
    });

    add('VALIDATE_RESPONSE', 'validateResponse', function VALIDATE_RESPONSE(resp) {
      if (this.service.successfulResponse(resp, this)) {
        resp.data = {};
        resp.error = null;
      } else {
        resp.data = null;
        resp.error = AWS.util.error(new Error(),
          {code: 'UnknownError', message: 'An unknown error occurred.'});
      }
    });

    addAsync('SEND', 'send', function SEND(resp, done) {
      resp.httpResponse._abortCallback = done;
      resp.error = null;
      resp.data = null;

      function callback(httpResp) {
        resp.httpResponse.stream = httpResp;

        httpResp.on('headers', function onHeaders(statusCode, headers) {
          resp.request.emit('httpHeaders', [statusCode, headers, resp]);

          if (!resp.httpResponse.streaming) {
            if (AWS.HttpClient.streamsApiVersion === 2) { // streams2 API check
              httpResp.on('readable', function onReadable() {
                var data = httpResp.read();
                if (data !== null) {
                  resp.request.emit('httpData', [data, resp]);
                }
              });
            } else { // legacy streams API
              httpResp.on('data', function onData(data) {
                resp.request.emit('httpData', [data, resp]);
              });
            }
          }
        });

        httpResp.on('end', function onEnd() {
          resp.request.emit('httpDone');
          done();
        });
      }

      function progress(httpResp) {
        httpResp.on('sendProgress', function onSendProgress(value) {
          resp.request.emit('httpUploadProgress', [value, resp]);
        });

        httpResp.on('receiveProgress', function onReceiveProgress(value) {
          resp.request.emit('httpDownloadProgress', [value, resp]);
        });
      }

      function error(err) {
        resp.error = AWS.util.error(err, {
          code: 'NetworkingError',
          region: resp.request.httpRequest.region,
          hostname: resp.request.httpRequest.endpoint.hostname,
          retryable: true
        });
        resp.request.emit('httpError', [resp.error, resp], function() {
          done();
        });
      }

      function executeSend() {
        var http = AWS.HttpClient.getInstance();
        var httpOptions = resp.request.service.config.httpOptions || {};
        try {
          var stream = http.handleRequest(resp.request.httpRequest, httpOptions,
                                          callback, error);
          progress(stream);
        } catch (err) {
          error(err);
        }
      }

      var timeDiff = (AWS.util.date.getDate() - this.signedAt) / 1000;
      if (timeDiff >= 60 * 10) { // if we signed 10min ago, re-sign
        this.emit('sign', [this], function(err) {
          if (err) done(err);
          else executeSend();
        });
      } else {
        executeSend();
      }
    });

    add('HTTP_HEADERS', 'httpHeaders',
        function HTTP_HEADERS(statusCode, headers, resp) {
      resp.httpResponse.statusCode = statusCode;
      resp.httpResponse.headers = headers;
      resp.httpResponse.body = new AWS.util.Buffer('');
      resp.httpResponse.buffers = [];
      resp.httpResponse.numBytes = 0;
      var dateHeader = headers.date || headers.Date;
      if (dateHeader) {
        var serverTime = Date.parse(dateHeader);
        if (resp.request.service.config.correctClockSkew
            && AWS.util.isClockSkewed(serverTime)) {
          AWS.util.applyClockOffset(serverTime);
        }
      }
    });

    add('HTTP_DATA', 'httpData', function HTTP_DATA(chunk, resp) {
      if (chunk) {
        if (AWS.util.isNode()) {
          resp.httpResponse.numBytes += chunk.length;

          var total = resp.httpResponse.headers['content-length'];
          var progress = { loaded: resp.httpResponse.numBytes, total: total };
          resp.request.emit('httpDownloadProgress', [progress, resp]);
        }

        resp.httpResponse.buffers.push(new AWS.util.Buffer(chunk));
      }
    });

    add('HTTP_DONE', 'httpDone', function HTTP_DONE(resp) {
      if (resp.httpResponse.buffers && resp.httpResponse.buffers.length > 0) {
        var body = AWS.util.buffer.concat(resp.httpResponse.buffers);
        resp.httpResponse.body = body;
      }
      delete resp.httpResponse.numBytes;
      delete resp.httpResponse.buffers;
    });

    add('FINALIZE_ERROR', 'retry', function FINALIZE_ERROR(resp) {
      if (resp.httpResponse.statusCode) {
        resp.error.statusCode = resp.httpResponse.statusCode;
        if (resp.error.retryable === undefined) {
          resp.error.retryable = this.service.retryableError(resp.error, this);
        }
      }
    });

    add('INVALIDATE_CREDENTIALS', 'retry', function INVALIDATE_CREDENTIALS(resp) {
      if (!resp.error) return;
      switch (resp.error.code) {
        case 'RequestExpired': // EC2 only
        case 'ExpiredTokenException':
        case 'ExpiredToken':
          resp.error.retryable = true;
          resp.request.service.config.credentials.expired = true;
      }
    });

    add('EXPIRED_SIGNATURE', 'retry', function EXPIRED_SIGNATURE(resp) {
      var err = resp.error;
      if (!err) return;
      if (typeof err.code === 'string' && typeof err.message === 'string') {
        if (err.code.match(/Signature/) && err.message.match(/expired/)) {
          resp.error.retryable = true;
        }
      }
    });

    add('CLOCK_SKEWED', 'retry', function CLOCK_SKEWED(resp) {
      if (!resp.error) return;
      if (this.service.clockSkewError(resp.error)
          && this.service.config.correctClockSkew
          && AWS.config.isClockSkewed) {
        resp.error.retryable = true;
      }
    });

    add('REDIRECT', 'retry', function REDIRECT(resp) {
      if (resp.error && resp.error.statusCode >= 300 &&
          resp.error.statusCode < 400 && resp.httpResponse.headers['location']) {
        this.httpRequest.endpoint =
          new AWS.Endpoint(resp.httpResponse.headers['location']);
        this.httpRequest.headers['Host'] = this.httpRequest.endpoint.host;
        resp.error.redirect = true;
        resp.error.retryable = true;
      }
    });

    add('RETRY_CHECK', 'retry', function RETRY_CHECK(resp) {
      if (resp.error) {
        if (resp.error.redirect && resp.redirectCount < resp.maxRedirects) {
          resp.error.retryDelay = 0;
        } else if (resp.retryCount < resp.maxRetries) {
          resp.error.retryDelay = this.service.retryDelays(resp.retryCount) || 0;
        }
      }
    });

    addAsync('RESET_RETRY_STATE', 'afterRetry', function RESET_RETRY_STATE(resp, done) {
      var delay, willRetry = false;

      if (resp.error) {
        delay = resp.error.retryDelay || 0;
        if (resp.error.retryable && resp.retryCount < resp.maxRetries) {
          resp.retryCount++;
          willRetry = true;
        } else if (resp.error.redirect && resp.redirectCount < resp.maxRedirects) {
          resp.redirectCount++;
          willRetry = true;
        }
      }

      if (willRetry) {
        resp.error = null;
        setTimeout(done, delay);
      } else {
        done();
      }
    });
  }),

  CorePost: new SequentialExecutor().addNamedListeners(function(add) {
    add('EXTRACT_REQUEST_ID', 'extractData', AWS.util.extractRequestId);
    add('EXTRACT_REQUEST_ID', 'extractError', AWS.util.extractRequestId);

    add('ENOTFOUND_ERROR', 'httpError', function ENOTFOUND_ERROR(err) {
      if (err.code === 'NetworkingError' && err.errno === 'ENOTFOUND') {
        var message = 'Inaccessible host: `' + err.hostname +
          '\'. This service may not be available in the `' + err.region +
          '\' region.';
        this.response.error = AWS.util.error(new Error(message), {
          code: 'UnknownEndpoint',
          region: err.region,
          hostname: err.hostname,
          retryable: true,
          originalError: err
        });
      }
    });
  }),

  Logger: new SequentialExecutor().addNamedListeners(function(add) {
    add('LOG_REQUEST', 'complete', function LOG_REQUEST(resp) {
      var req = resp.request;
      var logger = req.service.config.logger;
      if (!logger) return;

      function buildMessage() {
        var time = AWS.util.date.getDate().getTime();
        var delta = (time - req.startTime.getTime()) / 1000;
        var ansi = logger.isTTY ? true : false;
        var status = resp.httpResponse.statusCode;
        var params = require('util').inspect(req.params, true, null);

        var message = '';
        if (ansi) message += '\x1B[33m';
        message += '[AWS ' + req.service.serviceIdentifier + ' ' + status;
        message += ' ' + delta.toString() + 's ' + resp.retryCount + ' retries]';
        if (ansi) message += '\x1B[0;1m';
        message += ' ' + AWS.util.string.lowerFirst(req.operation);
        message += '(' + params + ')';
        if (ansi) message += '\x1B[0m';
        return message;
      }

      var line = buildMessage();
      if (typeof logger.log === 'function') {
        logger.log(line);
      } else if (typeof logger.write === 'function') {
        logger.write(line + '\n');
      }
    });
  }),

  Json: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = require('./protocol/json');
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  Rest: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = require('./protocol/rest');
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  RestJson: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = require('./protocol/rest_json');
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  RestXml: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = require('./protocol/rest_xml');
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  Query: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = require('./protocol/query');
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  })
};

},{"./core":11,"./protocol/json":30,"./protocol/query":31,"./protocol/rest":32,"./protocol/rest_json":33,"./protocol/rest_xml":34,"./sequential_executor":41,"util":68}],19:[function(require,module,exports){
var AWS = require('./core');
var inherit = AWS.util.inherit;


AWS.Endpoint = inherit({


  constructor: function Endpoint(endpoint, config) {
    AWS.util.hideProperties(this, ['slashes', 'auth', 'hash', 'search', 'query']);

    if (typeof endpoint === 'undefined' || endpoint === null) {
      throw new Error('Invalid endpoint: ' + endpoint);
    } else if (typeof endpoint !== 'string') {
      return AWS.util.copy(endpoint);
    }

    if (!endpoint.match(/^http/)) {
      var useSSL = config && config.sslEnabled !== undefined ?
        config.sslEnabled : AWS.config.sslEnabled;
      endpoint = (useSSL ? 'https' : 'http') + '://' + endpoint;
    }

    AWS.util.update(this, AWS.util.urlParse(endpoint));

    if (this.port) {
      this.port = parseInt(this.port, 10);
    } else {
      this.port = this.protocol === 'https:' ? 443 : 80;
    }
  }

});


AWS.HttpRequest = inherit({


  constructor: function HttpRequest(endpoint, region, customUserAgent) {
    endpoint = new AWS.Endpoint(endpoint);
    this.method = 'POST';
    this.path = endpoint.path || '/';
    this.headers = {};
    this.body = '';
    this.endpoint = endpoint;
    this.region = region;
    this.setUserAgent(customUserAgent);
  },


  setUserAgent: function setUserAgent(customUserAgent) {
    var prefix = AWS.util.isBrowser() ? 'X-Amz-' : '';
    var customSuffix = '';
    if (typeof customUserAgent === 'string' && customUserAgent) {
      customSuffix += ' ' + customUserAgent;
    }
    this.headers[prefix + 'User-Agent'] = AWS.util.userAgent() + customSuffix;
  },


  pathname: function pathname() {
    return this.path.split('?', 1)[0];
  },


  search: function search() {
    var query = this.path.split('?', 2)[1];
    if (query) {
      query = AWS.util.queryStringParse(query);
      return AWS.util.queryParamsToString(query);
    }
    return '';
  }

});


AWS.HttpResponse = inherit({


  constructor: function HttpResponse() {
    this.statusCode = undefined;
    this.headers = {};
    this.body = undefined;
    this.streaming = false;
    this.stream = null;
  },


  createUnbufferedStream: function createUnbufferedStream() {
    this.streaming = true;
    return this.stream;
  }
});


AWS.HttpClient = inherit({});


AWS.HttpClient.getInstance = function getInstance() {
  if (this.singleton === undefined) {
    this.singleton = new this();
  }
  return this.singleton;
};

},{"./core":11}],20:[function(require,module,exports){
var AWS = require('../core');
var EventEmitter = require('events').EventEmitter;
require('../http');


AWS.XHRClient = AWS.util.inherit({
  handleRequest: function handleRequest(httpRequest, httpOptions, callback, errCallback) {
    var self = this;
    var endpoint = httpRequest.endpoint;
    var emitter = new EventEmitter();
    var href = endpoint.protocol + '//' + endpoint.hostname;
    if (endpoint.port !== 80 && endpoint.port !== 443) {
      href += ':' + endpoint.port;
    }
    href += httpRequest.path;

    var xhr = new XMLHttpRequest(), headersEmitted = false;
    httpRequest.stream = xhr;

    xhr.addEventListener('readystatechange', function() {
      try {
        if (xhr.status === 0) return; // 0 code is invalid
      } catch (e) { return; }

      if (this.readyState >= this.HEADERS_RECEIVED && !headersEmitted) {
        try { xhr.responseType = 'arraybuffer'; } catch (e) {}
        emitter.statusCode = xhr.status;
        emitter.headers = self.parseHeaders(xhr.getAllResponseHeaders());
        emitter.emit('headers', emitter.statusCode, emitter.headers);
        headersEmitted = true;
      }
      if (this.readyState === this.DONE) {
        self.finishRequest(xhr, emitter);
      }
    }, false);
    xhr.upload.addEventListener('progress', function (evt) {
      emitter.emit('sendProgress', evt);
    });
    xhr.addEventListener('progress', function (evt) {
      emitter.emit('receiveProgress', evt);
    }, false);
    xhr.addEventListener('timeout', function () {
      errCallback(AWS.util.error(new Error('Timeout'), {code: 'TimeoutError'}));
    }, false);
    xhr.addEventListener('error', function () {
      errCallback(AWS.util.error(new Error('Network Failure'), {
        code: 'NetworkingError'
      }));
    }, false);

    callback(emitter);
    xhr.open(httpRequest.method, href, httpOptions.xhrAsync !== false);
    AWS.util.each(httpRequest.headers, function (key, value) {
      if (key !== 'Content-Length' && key !== 'User-Agent' && key !== 'Host') {
        xhr.setRequestHeader(key, value);
      }
    });

    if (httpOptions.timeout && httpOptions.xhrAsync !== false) {
      xhr.timeout = httpOptions.timeout;
    }

    if (httpOptions.xhrWithCredentials) {
      xhr.withCredentials = true;
    }

    try {
      xhr.send(httpRequest.body);
    } catch (err) {
      if (httpRequest.body && typeof httpRequest.body.buffer === 'object') {
        xhr.send(httpRequest.body.buffer); // send ArrayBuffer directly
      } else {
        throw err;
      }
    }

    return emitter;
  },

  parseHeaders: function parseHeaders(rawHeaders) {
    var headers = {};
    AWS.util.arrayEach(rawHeaders.split(/\r?\n/), function (line) {
      var key = line.split(':', 1)[0];
      var value = line.substring(key.length + 2);
      if (key.length > 0) headers[key.toLowerCase()] = value;
    });
    return headers;
  },

  finishRequest: function finishRequest(xhr, emitter) {
    var buffer;
    if (xhr.responseType === 'arraybuffer' && xhr.response) {
      var ab = xhr.response;
      buffer = new AWS.util.Buffer(ab.byteLength);
      var view = new Uint8Array(ab);
      for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
      }
    }

    try {
      if (!buffer && typeof xhr.responseText === 'string') {
        buffer = new AWS.util.Buffer(xhr.responseText);
      }
    } catch (e) {}

    if (buffer) emitter.emit('data', buffer);
    emitter.emit('end');
  }
});


AWS.HttpClient.prototype = AWS.XHRClient.prototype;


AWS.HttpClient.streamsApiVersion = 1;

},{"../core":11,"../http":19,"events":60}],21:[function(require,module,exports){
var util = require('../util');

function JsonBuilder() { }

JsonBuilder.prototype.build = function(value, shape) {
  return JSON.stringify(translate(value, shape));
};

function translate(value, shape) {
  if (!shape || value === undefined || value === null) return undefined;

  switch (shape.type) {
    case 'structure': return translateStructure(value, shape);
    case 'map': return translateMap(value, shape);
    case 'list': return translateList(value, shape);
    default: return translateScalar(value, shape);
  }
}

function translateStructure(structure, shape) {
  var struct = {};
  util.each(structure, function(name, value) {
    var memberShape = shape.members[name];
    if (memberShape) {
      if (memberShape.location !== 'body') return;
      var locationName = memberShape.isLocationName ? memberShape.name : name;
      var result = translate(value, memberShape);
      if (result !== undefined) struct[locationName] = result;
    }
  });
  return struct;
}

function translateList(list, shape) {
  var out = [];
  util.arrayEach(list, function(value) {
    var result = translate(value, shape.member);
    if (result !== undefined) out.push(result);
  });
  return out;
}

function translateMap(map, shape) {
  var out = {};
  util.each(map, function(key, value) {
    var result = translate(value, shape.value);
    if (result !== undefined) out[key] = result;
  });
  return out;
}

function translateScalar(value, shape) {
  return shape.toWireFormat(value);
}

module.exports = JsonBuilder;

},{"../util":53}],22:[function(require,module,exports){
var util = require('../util');

function JsonParser() { }

JsonParser.prototype.parse = function(value, shape) {
  return translate(JSON.parse(value), shape);
};

function translate(value, shape) {
  if (!shape || value === undefined) return undefined;

  switch (shape.type) {
    case 'structure': return translateStructure(value, shape);
    case 'map': return translateMap(value, shape);
    case 'list': return translateList(value, shape);
    default: return translateScalar(value, shape);
  }
}

function translateStructure(structure, shape) {
  if (structure == null) return undefined;

  var struct = {};
  var shapeMembers = shape.members;
  util.each(shapeMembers, function(name, memberShape) {
    var locationName = memberShape.isLocationName ? memberShape.name : name;
    if (Object.prototype.hasOwnProperty.call(structure, locationName)) {
      var value = structure[locationName];
      var result = translate(value, memberShape);
      if (result !== undefined) struct[name] = result;
    }
  });
  return struct;
}

function translateList(list, shape) {
  if (list == null) return undefined;

  var out = [];
  util.arrayEach(list, function(value) {
    var result = translate(value, shape.member);
    if (result === undefined) out.push(null);
    else out.push(result);
  });
  return out;
}

function translateMap(map, shape) {
  if (map == null) return undefined;

  var out = {};
  util.each(map, function(key, value) {
    var result = translate(value, shape.value);
    if (result === undefined) out[key] = null;
    else out[key] = result;
  });
  return out;
}

function translateScalar(value, shape) {
  return shape.toType(value);
}

module.exports = JsonParser;

},{"../util":53}],23:[function(require,module,exports){
var Collection = require('./collection');
var Operation = require('./operation');
var Shape = require('./shape');
var Paginator = require('./paginator');
var ResourceWaiter = require('./resource_waiter');

var util = require('../util');
var property = util.property;
var memoizedProperty = util.memoizedProperty;

function Api(api, options) {
  api = api || {};
  options = options || {};
  options.api = this;

  api.metadata = api.metadata || {};

  property(this, 'isApi', true, false);
  property(this, 'apiVersion', api.metadata.apiVersion);
  property(this, 'endpointPrefix', api.metadata.endpointPrefix);
  property(this, 'signingName', api.metadata.signingName);
  property(this, 'globalEndpoint', api.metadata.globalEndpoint);
  property(this, 'signatureVersion', api.metadata.signatureVersion);
  property(this, 'jsonVersion', api.metadata.jsonVersion);
  property(this, 'targetPrefix', api.metadata.targetPrefix);
  property(this, 'protocol', api.metadata.protocol);
  property(this, 'timestampFormat', api.metadata.timestampFormat);
  property(this, 'xmlNamespaceUri', api.metadata.xmlNamespace);
  property(this, 'abbreviation', api.metadata.serviceAbbreviation);
  property(this, 'fullName', api.metadata.serviceFullName);

  memoizedProperty(this, 'className', function() {
    var name = api.metadata.serviceAbbreviation || api.metadata.serviceFullName;
    if (!name) return null;

    name = name.replace(/^Amazon|AWS\s*|\(.*|\s+|\W+/g, '');
    if (name === 'ElasticLoadBalancing') name = 'ELB';
    return name;
  });

  property(this, 'operations', new Collection(api.operations, options, function(name, operation) {
    return new Operation(name, operation, options);
  }, util.string.lowerFirst));

  property(this, 'shapes', new Collection(api.shapes, options, function(name, shape) {
    return Shape.create(shape, options);
  }));

  property(this, 'paginators', new Collection(api.paginators, options, function(name, paginator) {
    return new Paginator(name, paginator, options);
  }));

  property(this, 'waiters', new Collection(api.waiters, options, function(name, waiter) {
    return new ResourceWaiter(name, waiter, options);
  }, util.string.lowerFirst));

  if (options.documentation) {
    property(this, 'documentation', api.documentation);
    property(this, 'documentationUrl', api.documentationUrl);
  }
}

module.exports = Api;

},{"../util":53,"./collection":24,"./operation":25,"./paginator":26,"./resource_waiter":27,"./shape":28}],24:[function(require,module,exports){
var memoizedProperty = require('../util').memoizedProperty;

function memoize(name, value, fn, nameTr) {
  memoizedProperty(this, nameTr(name), function() {
    return fn(name, value);
  });
}

function Collection(iterable, options, fn, nameTr) {
  nameTr = nameTr || String;
  var self = this;

  for (var id in iterable) {
    if (Object.prototype.hasOwnProperty.call(iterable, id)) {
      memoize.call(self, id, iterable[id], fn, nameTr);
    }
  }
}

module.exports = Collection;

},{"../util":53}],25:[function(require,module,exports){
var Shape = require('./shape');

var util = require('../util');
var property = util.property;
var memoizedProperty = util.memoizedProperty;

function Operation(name, operation, options) {
  options = options || {};

  property(this, 'name', operation.name || name);
  property(this, 'api', options.api, false);

  operation.http = operation.http || {};
  property(this, 'httpMethod', operation.http.method || 'POST');
  property(this, 'httpPath', operation.http.requestUri || '/');
  property(this, 'authtype', operation.authtype || '');

  memoizedProperty(this, 'input', function() {
    if (!operation.input) {
      return new Shape.create({type: 'structure'}, options);
    }
    return Shape.create(operation.input, options);
  });

  memoizedProperty(this, 'output', function() {
    if (!operation.output) {
      return new Shape.create({type: 'structure'}, options);
    }
    return Shape.create(operation.output, options);
  });

  memoizedProperty(this, 'errors', function() {
    var list = [];
    if (!operation.errors) return null;

    for (var i = 0; i < operation.errors.length; i++) {
      list.push(Shape.create(operation.errors[i], options));
    }

    return list;
  });

  memoizedProperty(this, 'paginator', function() {
    return options.api.paginators[name];
  });

  if (options.documentation) {
    property(this, 'documentation', operation.documentation);
    property(this, 'documentationUrl', operation.documentationUrl);
  }
}

module.exports = Operation;

},{"../util":53,"./shape":28}],26:[function(require,module,exports){
var property = require('../util').property;

function Paginator(name, paginator) {
  property(this, 'inputToken', paginator.input_token);
  property(this, 'limitKey', paginator.limit_key);
  property(this, 'moreResults', paginator.more_results);
  property(this, 'outputToken', paginator.output_token);
  property(this, 'resultKey', paginator.result_key);
}

module.exports = Paginator;

},{"../util":53}],27:[function(require,module,exports){
var util = require('../util');
var property = util.property;

function ResourceWaiter(name, waiter, options) {
  options = options || {};
  property(this, 'name', name);
  property(this, 'api', options.api, false);

  if (waiter.operation) {
    property(this, 'operation', util.string.lowerFirst(waiter.operation));
  }

  var self = this;
  var keys = [
    'type',
    'description',
    'delay',
    'maxAttempts',
    'acceptors'
  ];

  keys.forEach(function(key) {
    var value = waiter[key];
    if (value) {
      property(self, key, value);
    }
  });
}

module.exports = ResourceWaiter;

},{"../util":53}],28:[function(require,module,exports){
var Collection = require('./collection');

var util = require('../util');

function property(obj, name, value) {
  if (value !== null && value !== undefined) {
    util.property.apply(this, arguments);
  }
}

function memoizedProperty(obj, name) {
  if (!obj.constructor.prototype[name]) {
    util.memoizedProperty.apply(this, arguments);
  }
}

function Shape(shape, options, memberName) {
  options = options || {};

  property(this, 'shape', shape.shape);
  property(this, 'api', options.api, false);
  property(this, 'type', shape.type);
  property(this, 'enum', shape.enum);
  property(this, 'min', shape.min);
  property(this, 'max', shape.max);
  property(this, 'pattern', shape.pattern);
  property(this, 'location', shape.location || this.location || 'body');
  property(this, 'name', this.name || shape.xmlName || shape.queryName ||
    shape.locationName || memberName);
  property(this, 'isStreaming', shape.streaming || this.isStreaming || false);
  property(this, 'isComposite', shape.isComposite || false);
  property(this, 'isShape', true, false);
  property(this, 'isQueryName', shape.queryName ? true : false, false);
  property(this, 'isLocationName', shape.locationName ? true : false, false);

  if (options.documentation) {
    property(this, 'documentation', shape.documentation);
    property(this, 'documentationUrl', shape.documentationUrl);
  }

  if (shape.xmlAttribute) {
    property(this, 'isXmlAttribute', shape.xmlAttribute || false);
  }

  property(this, 'defaultValue', null);
  this.toWireFormat = function(value) {
    if (value === null || value === undefined) return '';
    return value;
  };
  this.toType = function(value) { return value; };
}


Shape.normalizedTypes = {
  character: 'string',
  double: 'float',
  long: 'integer',
  short: 'integer',
  biginteger: 'integer',
  bigdecimal: 'float',
  blob: 'binary'
};


Shape.types = {
  'structure': StructureShape,
  'list': ListShape,
  'map': MapShape,
  'boolean': BooleanShape,
  'timestamp': TimestampShape,
  'float': FloatShape,
  'integer': IntegerShape,
  'string': StringShape,
  'base64': Base64Shape,
  'binary': BinaryShape
};

Shape.resolve = function resolve(shape, options) {
  if (shape.shape) {
    var refShape = options.api.shapes[shape.shape];
    if (!refShape) {
      throw new Error('Cannot find shape reference: ' + shape.shape);
    }

    return refShape;
  } else {
    return null;
  }
};

Shape.create = function create(shape, options, memberName) {
  if (shape.isShape) return shape;

  var refShape = Shape.resolve(shape, options);
  if (refShape) {
    var filteredKeys = Object.keys(shape);
    if (!options.documentation) {
      filteredKeys = filteredKeys.filter(function(name) {
        return !name.match(/documentation/);
      });
    }
    if (filteredKeys === ['shape']) { // no inline customizations
      return refShape;
    }

    var InlineShape = function() {
      refShape.constructor.call(this, shape, options, memberName);
    };
    InlineShape.prototype = refShape;
    return new InlineShape();
  } else {
    if (!shape.type) {
      if (shape.members) shape.type = 'structure';
      else if (shape.member) shape.type = 'list';
      else if (shape.key) shape.type = 'map';
      else shape.type = 'string';
    }

    var origType = shape.type;
    if (Shape.normalizedTypes[shape.type]) {
      shape.type = Shape.normalizedTypes[shape.type];
    }

    if (Shape.types[shape.type]) {
      return new Shape.types[shape.type](shape, options, memberName);
    } else {
      throw new Error('Unrecognized shape type: ' + origType);
    }
  }
};

function CompositeShape(shape) {
  Shape.apply(this, arguments);
  property(this, 'isComposite', true);

  if (shape.flattened) {
    property(this, 'flattened', shape.flattened || false);
  }
}

function StructureShape(shape, options) {
  var requiredMap = null, firstInit = !this.isShape;

  CompositeShape.apply(this, arguments);

  if (firstInit) {
    property(this, 'defaultValue', function() { return {}; });
    property(this, 'members', {});
    property(this, 'memberNames', []);
    property(this, 'required', []);
    property(this, 'isRequired', function() { return false; });
  }

  if (shape.members) {
    property(this, 'members', new Collection(shape.members, options, function(name, member) {
      return Shape.create(member, options, name);
    }));
    memoizedProperty(this, 'memberNames', function() {
      return shape.xmlOrder || Object.keys(shape.members);
    });
  }

  if (shape.required) {
    property(this, 'required', shape.required);
    property(this, 'isRequired', function(name) {
      if (!requiredMap) {
        requiredMap = {};
        for (var i = 0; i < shape.required.length; i++) {
          requiredMap[shape.required[i]] = true;
        }
      }

      return requiredMap[name];
    }, false, true);
  }

  property(this, 'resultWrapper', shape.resultWrapper || null);

  if (shape.payload) {
    property(this, 'payload', shape.payload);
  }

  if (typeof shape.xmlNamespace === 'string') {
    property(this, 'xmlNamespaceUri', shape.xmlNamespace);
  } else if (typeof shape.xmlNamespace === 'object') {
    property(this, 'xmlNamespacePrefix', shape.xmlNamespace.prefix);
    property(this, 'xmlNamespaceUri', shape.xmlNamespace.uri);
  }
}

function ListShape(shape, options) {
  var self = this, firstInit = !this.isShape;
  CompositeShape.apply(this, arguments);

  if (firstInit) {
    property(this, 'defaultValue', function() { return []; });
  }

  if (shape.member) {
    memoizedProperty(this, 'member', function() {
      return Shape.create(shape.member, options);
    });
  }

  if (this.flattened) {
    var oldName = this.name;
    memoizedProperty(this, 'name', function() {
      return self.member.name || oldName;
    });
  }
}

function MapShape(shape, options) {
  var firstInit = !this.isShape;
  CompositeShape.apply(this, arguments);

  if (firstInit) {
    property(this, 'defaultValue', function() { return {}; });
    property(this, 'key', Shape.create({type: 'string'}, options));
    property(this, 'value', Shape.create({type: 'string'}, options));
  }

  if (shape.key) {
    memoizedProperty(this, 'key', function() {
      return Shape.create(shape.key, options);
    });
  }
  if (shape.value) {
    memoizedProperty(this, 'value', function() {
      return Shape.create(shape.value, options);
    });
  }
}

function TimestampShape(shape) {
  var self = this;
  Shape.apply(this, arguments);

  if (this.location === 'header') {
    property(this, 'timestampFormat', 'rfc822');
  } else if (shape.timestampFormat) {
    property(this, 'timestampFormat', shape.timestampFormat);
  } else if (this.api) {
    if (this.api.timestampFormat) {
      property(this, 'timestampFormat', this.api.timestampFormat);
    } else {
      switch (this.api.protocol) {
        case 'json':
        case 'rest-json':
          property(this, 'timestampFormat', 'unixTimestamp');
          break;
        case 'rest-xml':
        case 'query':
        case 'ec2':
          property(this, 'timestampFormat', 'iso8601');
          break;
      }
    }
  }

  this.toType = function(value) {
    if (value === null || value === undefined) return null;
    if (typeof value.toUTCString === 'function') return value;
    return typeof value === 'string' || typeof value === 'number' ?
           util.date.parseTimestamp(value) : null;
  };

  this.toWireFormat = function(value) {
    return util.date.format(value, self.timestampFormat);
  };
}

function StringShape() {
  Shape.apply(this, arguments);

  if (this.api) {
    switch (this.api.protocol) {
      case 'rest-xml':
      case 'query':
      case 'ec2':
        this.toType = function(value) { return value || ''; };
    }
  }
}

function FloatShape() {
  Shape.apply(this, arguments);

  this.toType = function(value) {
    if (value === null || value === undefined) return null;
    return parseFloat(value);
  };
  this.toWireFormat = this.toType;
}

function IntegerShape() {
  Shape.apply(this, arguments);

  this.toType = function(value) {
    if (value === null || value === undefined) return null;
    return parseInt(value, 10);
  };
  this.toWireFormat = this.toType;
}

function BinaryShape() {
  Shape.apply(this, arguments);
  this.toType = util.base64.decode;
  this.toWireFormat = util.base64.encode;
}

function Base64Shape() {
  BinaryShape.apply(this, arguments);
}

function BooleanShape() {
  Shape.apply(this, arguments);

  this.toType = function(value) {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined) return null;
    return value === 'true';
  };
}


Shape.shapes = {
  StructureShape: StructureShape,
  ListShape: ListShape,
  MapShape: MapShape,
  StringShape: StringShape,
  BooleanShape: BooleanShape,
  Base64Shape: Base64Shape
};

module.exports = Shape;

},{"../util":53,"./collection":24}],29:[function(require,module,exports){
var AWS = require('./core');


AWS.ParamValidator = AWS.util.inherit({

  constructor: function ParamValidator(validation) {
    if (validation === true || validation === undefined) {
      validation = {'min': true};
    }
    this.validation = validation;
  },

  validate: function validate(shape, params, context) {
    this.errors = [];
    this.validateMember(shape, params || {}, context || 'params');

    if (this.errors.length > 1) {
      var msg = this.errors.join('\n* ');
      msg = 'There were ' + this.errors.length +
        ' validation errors:\n* ' + msg;
      throw AWS.util.error(new Error(msg),
        {code: 'MultipleValidationErrors', errors: this.errors});
    } else if (this.errors.length === 1) {
      throw this.errors[0];
    } else {
      return true;
    }
  },

  fail: function fail(code, message) {
    this.errors.push(AWS.util.error(new Error(message), {code: code}));
  },

  validateStructure: function validateStructure(shape, params, context) {
    this.validateType(params, context, ['object'], 'structure');

    var paramName;
    for (var i = 0; shape.required && i < shape.required.length; i++) {
      paramName = shape.required[i];
      var value = params[paramName];
      if (value === undefined || value === null) {
        this.fail('MissingRequiredParameter',
          'Missing required key \'' + paramName + '\' in ' + context);
      }
    }

    for (paramName in params) {
      if (!Object.prototype.hasOwnProperty.call(params, paramName)) continue;

      var paramValue = params[paramName],
          memberShape = shape.members[paramName];

      if (memberShape !== undefined) {
        var memberContext = [context, paramName].join('.');
        this.validateMember(memberShape, paramValue, memberContext);
      } else {
        this.fail('UnexpectedParameter',
          'Unexpected key \'' + paramName + '\' found in ' + context);
      }
    }

    return true;
  },

  validateMember: function validateMember(shape, param, context) {
    switch (shape.type) {
      case 'structure':
        return this.validateStructure(shape, param, context);
      case 'list':
        return this.validateList(shape, param, context);
      case 'map':
        return this.validateMap(shape, param, context);
      default:
        return this.validateScalar(shape, param, context);
    }
  },

  validateList: function validateList(shape, params, context) {
    if (this.validateType(params, context, [Array])) {
      this.validateRange(shape, params.length, context, 'list member count');
      for (var i = 0; i < params.length; i++) {
        this.validateMember(shape.member, params[i], context + '[' + i + ']');
      }
    }
  },

  validateMap: function validateMap(shape, params, context) {
    if (this.validateType(params, context, ['object'], 'map')) {
      var mapCount = 0;
      for (var param in params) {
        if (!Object.prototype.hasOwnProperty.call(params, param)) continue;
        this.validateMember(shape.key, param,
                            context + '[key=\'' + param + '\']')
        this.validateMember(shape.value, params[param],
                            context + '[\'' + param + '\']');
        mapCount++;
      }
      this.validateRange(shape, mapCount, context, 'map member count');
    }
  },

  validateScalar: function validateScalar(shape, value, context) {
    switch (shape.type) {
      case null:
      case undefined:
      case 'string':
        return this.validateString(shape, value, context);
      case 'base64':
      case 'binary':
        return this.validatePayload(value, context);
      case 'integer':
      case 'float':
        return this.validateNumber(shape, value, context);
      case 'boolean':
        return this.validateType(value, context, ['boolean']);
      case 'timestamp':
        return this.validateType(value, context, [Date,
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/, 'number'],
          'Date object, ISO-8601 string, or a UNIX timestamp');
      default:
        return this.fail('UnkownType', 'Unhandled type ' +
                         shape.type + ' for ' + context);
    }
  },

  validateString: function validateString(shape, value, context) {
    if (this.validateType(value, context, ['string'])) {
      this.validateEnum(shape, value, context);
      this.validateRange(shape, value.length, context, 'string length');
      this.validatePattern(shape, value, context);
    }
  },

  validatePattern: function validatePattern(shape, value, context) {
    if (this.validation['pattern'] && shape['pattern'] !== undefined) {
      if (!(new RegExp(shape['pattern'])).test(value)) {
        this.fail('PatternMatchError', 'Provided value "' + value + '" '
          + 'does not match regex pattern /' + shape['pattern'] + '/ for '
          + context);
      }
    }
  },

  validateRange: function validateRange(shape, value, context, descriptor) {
    if (this.validation['min']) {
      if (shape['min'] !== undefined && value < shape['min']) {
        this.fail('MinRangeError', 'Expected ' + descriptor + ' >= '
          + shape['min'] + ', but found ' + value + ' for ' + context);
      }
    }
    if (this.validation['max']) {
      if (shape['max'] !== undefined && value > shape['max']) {
        this.fail('MaxRangeError', 'Expected ' + descriptor + ' <= '
          + shape['max'] + ', but found ' + value + ' for ' + context);
      }
    }
  },

  validateEnum: function validateRange(shape, value, context) {
    if (this.validation['enum'] && shape['enum'] !== undefined) {
      if (shape['enum'].indexOf(value) === -1) {
        this.fail('EnumError', 'Found string value of ' + value + ', but '
          + 'expected ' + shape['enum'].join('|') + ' for ' + context);
      }
    }
  },

  validateType: function validateType(value, context, acceptedTypes, type) {
    if (value === null || value === undefined) return false;

    var foundInvalidType = false;
    for (var i = 0; i < acceptedTypes.length; i++) {
      if (typeof acceptedTypes[i] === 'string') {
        if (typeof value === acceptedTypes[i]) return true;
      } else if (acceptedTypes[i] instanceof RegExp) {
        if ((value || '').toString().match(acceptedTypes[i])) return true;
      } else {
        if (value instanceof acceptedTypes[i]) return true;
        if (AWS.util.isType(value, acceptedTypes[i])) return true;
        if (!type && !foundInvalidType) acceptedTypes = acceptedTypes.slice();
        acceptedTypes[i] = AWS.util.typeName(acceptedTypes[i]);
      }
      foundInvalidType = true;
    }

    var acceptedType = type;
    if (!acceptedType) {
      acceptedType = acceptedTypes.join(', ').replace(/,([^,]+)$/, ', or$1');
    }

    var vowel = acceptedType.match(/^[aeiou]/i) ? 'n' : '';
    this.fail('InvalidParameterType', 'Expected ' + context + ' to be a' +
              vowel + ' ' + acceptedType);
    return false;
  },

  validateNumber: function validateNumber(shape, value, context) {
    if (value === null || value === undefined) return;
    if (typeof value === 'string') {
      var castedValue = parseFloat(value);
      if (castedValue.toString() === value) value = castedValue;
    }
    if (this.validateType(value, context, ['number'])) {
      this.validateRange(shape, value, context, 'numeric value');
    }
  },

  validatePayload: function validatePayload(value, context) {
    if (value === null || value === undefined) return;
    if (typeof value === 'string') return;
    if (value && typeof value.byteLength === 'number') return; // typed arrays
    if (AWS.util.isNode()) { // special check for buffer/stream in Node.js
      var Stream = AWS.util.stream.Stream;
      if (AWS.util.Buffer.isBuffer(value) || value instanceof Stream) return;
    }

    var types = ['Buffer', 'Stream', 'File', 'Blob', 'ArrayBuffer', 'DataView'];
    if (value) {
      for (var i = 0; i < types.length; i++) {
        if (AWS.util.isType(value, types[i])) return;
        if (AWS.util.typeName(value.constructor) === types[i]) return;
      }
    }

    this.fail('InvalidParameterType', 'Expected ' + context + ' to be a ' +
      'string, Buffer, Stream, Blob, or typed array object');
  }
});

},{"./core":11}],30:[function(require,module,exports){
var util = require('../util');
var JsonBuilder = require('../json/builder');
var JsonParser = require('../json/parser');

function buildRequest(req) {
  var httpRequest = req.httpRequest;
  var api = req.service.api;
  var target = api.targetPrefix + '.' + api.operations[req.operation].name;
  var version = api.jsonVersion || '1.0';
  var input = api.operations[req.operation].input;
  var builder = new JsonBuilder();

  if (version === 1) version = '1.0';
  httpRequest.body = builder.build(req.params || {}, input);
  httpRequest.headers['Content-Type'] = 'application/x-amz-json-' + version;
  httpRequest.headers['X-Amz-Target'] = target;
}

function extractError(resp) {
  var error = {};
  var httpResponse = resp.httpResponse;

  error.code = httpResponse.headers['x-amzn-errortype'] || 'UnknownError';
  if (typeof error.code === 'string') {
    error.code = error.code.split(':')[0];
  }

  if (httpResponse.body.length > 0) {
    var e = JSON.parse(httpResponse.body.toString());
    if (e.__type || e.code) {
      error.code = (e.__type || e.code).split('#').pop();
    }
    if (error.code === 'RequestEntityTooLarge') {
      error.message = 'Request body must be less than 1 MB';
    } else {
      error.message = (e.message || e.Message || null);
    }
  } else {
    error.statusCode = httpResponse.statusCode;
    error.message = httpResponse.statusCode.toString();
  }

  resp.error = util.error(new Error(), error);
}

function extractData(resp) {
  var body = resp.httpResponse.body.toString() || '{}';
  if (resp.request.service.config.convertResponseTypes === false) {
    resp.data = JSON.parse(body);
  } else {
    var operation = resp.request.service.api.operations[resp.request.operation];
    var shape = operation.output || {};
    var parser = new JsonParser();
    resp.data = parser.parse(body, shape);
  }
}

module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData
};

},{"../json/builder":21,"../json/parser":22,"../util":53}],31:[function(require,module,exports){
var AWS = require('../core');
var util = require('../util');
var QueryParamSerializer = require('../query/query_param_serializer');
var Shape = require('../model/shape');

function buildRequest(req) {
  var operation = req.service.api.operations[req.operation];
  var httpRequest = req.httpRequest;
  httpRequest.headers['Content-Type'] =
    'application/x-www-form-urlencoded; charset=utf-8';
  httpRequest.params = {
    Version: req.service.api.apiVersion,
    Action: operation.name
  };

  var builder = new QueryParamSerializer();
  builder.serialize(req.params, operation.input, function(name, value) {
    httpRequest.params[name] = value;
  });
  httpRequest.body = util.queryParamsToString(httpRequest.params);
}

function extractError(resp) {
  var data, body = resp.httpResponse.body.toString();
  if (body.match('<UnknownOperationException')) {
    data = {
      Code: 'UnknownOperation',
      Message: 'Unknown operation ' + resp.request.operation
    };
  } else {
    data = new AWS.XML.Parser().parse(body);
  }

  if (data.requestId && !resp.requestId) resp.requestId = data.requestId;
  if (data.Errors) data = data.Errors;
  if (data.Error) data = data.Error;
  if (data.Code) {
    resp.error = util.error(new Error(), {
      code: data.Code,
      message: data.Message
    });
  } else {
    resp.error = util.error(new Error(), {
      code: resp.httpResponse.statusCode,
      message: null
    });
  }
}

function extractData(resp) {
  var req = resp.request;
  var operation = req.service.api.operations[req.operation];
  var shape = operation.output || {};
  var origRules = shape;

  if (origRules.resultWrapper) {
    var tmp = Shape.create({type: 'structure'});
    tmp.members[origRules.resultWrapper] = shape;
    tmp.memberNames = [origRules.resultWrapper];
    util.property(shape, 'name', shape.resultWrapper);
    shape = tmp;
  }

  var parser = new AWS.XML.Parser();

  if (shape && shape.members && !shape.members._XAMZRequestId) {
    var requestIdShape = Shape.create(
      { type: 'string' },
      { api: { protocol: 'query' } },
      'requestId'
    );
    shape.members._XAMZRequestId = requestIdShape;
  }

  var data = parser.parse(resp.httpResponse.body.toString(), shape);
  resp.requestId = data._XAMZRequestId || data.requestId;

  if (data._XAMZRequestId) delete data._XAMZRequestId;

  if (origRules.resultWrapper) {
    if (data[origRules.resultWrapper]) {
      util.update(data, data[origRules.resultWrapper]);
      delete data[origRules.resultWrapper];
    }
  }

  resp.data = data;
}

module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData
};

},{"../core":11,"../model/shape":28,"../query/query_param_serializer":35,"../util":53}],32:[function(require,module,exports){
var util = require('../util');

function populateMethod(req) {
  req.httpRequest.method = req.service.api.operations[req.operation].httpMethod;
}

function populateURI(req) {
  var operation = req.service.api.operations[req.operation];
  var input = operation.input;
  var uri = [req.httpRequest.endpoint.path, operation.httpPath].join('/');
  uri = uri.replace(/\/+/g, '/');

  var queryString = {}, queryStringSet = false;
  util.each(input.members, function (name, member) {
    var paramValue = req.params[name];
    if (paramValue === null || paramValue === undefined) return;
    if (member.location === 'uri') {
      var regex = new RegExp('\\{' + member.name + '(\\+)?\\}');
      uri = uri.replace(regex, function(_, plus) {
        var fn = plus ? util.uriEscapePath : util.uriEscape;
        return fn(String(paramValue));
      });
    } else if (member.location === 'querystring') {
      queryStringSet = true;

      if (member.type === 'list') {
        queryString[member.name] = paramValue.map(function(val) {
          return util.uriEscape(String(val));
        });
      } else if (member.type === 'map') {
        util.each(paramValue, function(key, value) {
          if (Array.isArray(value)) {
            queryString[key] = value.map(function(val) {
              return util.uriEscape(String(val));
            });
          } else {
            queryString[key] = util.uriEscape(String(value));
          }
        });
      } else {
        queryString[member.name] = util.uriEscape(String(paramValue));
      }
    }
  });

  if (queryStringSet) {
    uri += (uri.indexOf('?') >= 0 ? '&' : '?');
    var parts = [];
    util.arrayEach(Object.keys(queryString).sort(), function(key) {
      if (!Array.isArray(queryString[key])) {
        queryString[key] = [queryString[key]];
      }
      for (var i = 0; i < queryString[key].length; i++) {
        parts.push(util.uriEscape(String(key)) + '=' + queryString[key][i]);
      }
    });
    uri += parts.join('&');
  }

  req.httpRequest.path = uri;
}

function populateHeaders(req) {
  var operation = req.service.api.operations[req.operation];
  util.each(operation.input.members, function (name, member) {
    var value = req.params[name];
    if (value === null || value === undefined) return;

    if (member.location === 'headers' && member.type === 'map') {
      util.each(value, function(key, memberValue) {
        req.httpRequest.headers[member.name + key] = memberValue;
      });
    } else if (member.location === 'header') {
      value = member.toWireFormat(value).toString();
      req.httpRequest.headers[member.name] = value;
    }
  });
}

function buildRequest(req) {
  populateMethod(req);
  populateURI(req);
  populateHeaders(req);
}

function extractError() {
}

function extractData(resp) {
  var req = resp.request;
  var data = {};
  var r = resp.httpResponse;
  var operation = req.service.api.operations[req.operation];
  var output = operation.output;

  var headers = {};
  util.each(r.headers, function (k, v) {
    headers[k.toLowerCase()] = v;
  });

  util.each(output.members, function(name, member) {
    var header = (member.name || name).toLowerCase();
    if (member.location === 'headers' && member.type === 'map') {
      data[name] = {};
      var location = member.isLocationName ? member.name : '';
      var pattern = new RegExp('^' + location + '(.+)', 'i');
      util.each(r.headers, function (k, v) {
        var result = k.match(pattern);
        if (result !== null) {
          data[name][result[1]] = v;
        }
      });
    } else if (member.location === 'header') {
      if (headers[header] !== undefined) {
        data[name] = headers[header];
      }
    } else if (member.location === 'statusCode') {
      data[name] = parseInt(r.statusCode, 10);
    }
  });

  resp.data = data;
}

module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData
};

},{"../util":53}],33:[function(require,module,exports){
var util = require('../util');
var Rest = require('./rest');
var Json = require('./json');
var JsonBuilder = require('../json/builder');
var JsonParser = require('../json/parser');

function populateBody(req) {
  var builder = new JsonBuilder();
  var input = req.service.api.operations[req.operation].input;

  if (input.payload) {
    var params = {};
    var payloadShape = input.members[input.payload];
    params = req.params[input.payload];
    if (params === undefined) return;

    if (payloadShape.type === 'structure') {
      req.httpRequest.body = builder.build(params, payloadShape);
    } else { // non-JSON payload
      req.httpRequest.body = params;
    }
  } else {
    req.httpRequest.body = builder.build(req.params, input);
  }
}

function buildRequest(req) {
  Rest.buildRequest(req);

  if (['GET', 'HEAD', 'DELETE'].indexOf(req.httpRequest.method) < 0) {
    populateBody(req);
  }
}

function extractError(resp) {
  Json.extractError(resp);
}

function extractData(resp) {
  Rest.extractData(resp);

  var req = resp.request;
  var rules = req.service.api.operations[req.operation].output || {};
  if (rules.payload) {
    var payloadMember = rules.members[rules.payload];
    var body = resp.httpResponse.body;
    if (payloadMember.isStreaming) {
      resp.data[rules.payload] = body;
    } else if (payloadMember.type === 'structure' || payloadMember.type === 'list') {
      var parser = new JsonParser();
      resp.data[rules.payload] = parser.parse(body, payloadMember);
    } else {
      resp.data[rules.payload] = body.toString();
    }
  } else {
    var data = resp.data;
    Json.extractData(resp);
    resp.data = util.merge(data, resp.data);
  }
}

module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData
};

},{"../json/builder":21,"../json/parser":22,"../util":53,"./json":30,"./rest":32}],34:[function(require,module,exports){
var AWS = require('../core');
var util = require('../util');
var Rest = require('./rest');

function populateBody(req) {
  var input = req.service.api.operations[req.operation].input;
  var builder = new AWS.XML.Builder();
  var params = req.params;

  var payload = input.payload;
  if (payload) {
    var payloadMember = input.members[payload];
    params = params[payload];
    if (params === undefined) return;

    if (payloadMember.type === 'structure') {
      var rootElement = payloadMember.name;
      req.httpRequest.body = builder.toXML(params, payloadMember, rootElement, true);
    } else { // non-xml payload
      req.httpRequest.body = params;
    }
  } else {
    req.httpRequest.body = builder.toXML(params, input, input.name ||
      input.shape || util.string.upperFirst(req.operation) + 'Request');
  }
}

function buildRequest(req) {
  Rest.buildRequest(req);

  if (['GET', 'HEAD'].indexOf(req.httpRequest.method) < 0) {
    populateBody(req);
  }
}

function extractError(resp) {
  Rest.extractError(resp);

  var data = new AWS.XML.Parser().parse(resp.httpResponse.body.toString());
  if (data.Errors) data = data.Errors;
  if (data.Error) data = data.Error;
  if (data.Code) {
    resp.error = util.error(new Error(), {
      code: data.Code,
      message: data.Message
    });
  } else {
    resp.error = util.error(new Error(), {
      code: resp.httpResponse.statusCode,
      message: null
    });
  }
}

function extractData(resp) {
  Rest.extractData(resp);

  var parser;
  var req = resp.request;
  var body = resp.httpResponse.body;
  var operation = req.service.api.operations[req.operation];
  var output = operation.output;

  var payload = output.payload;
  if (payload) {
    var payloadMember = output.members[payload];
    if (payloadMember.isStreaming) {
      resp.data[payload] = body;
    } else if (payloadMember.type === 'structure') {
      parser = new AWS.XML.Parser();
      resp.data[payload] = parser.parse(body.toString(), payloadMember);
    } else {
      resp.data[payload] = body.toString();
    }
  } else if (body.length > 0) {
    parser = new AWS.XML.Parser();
    var data = parser.parse(body.toString(), output);
    util.update(resp.data, data);
  }
}

module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData
};

},{"../core":11,"../util":53,"./rest":32}],35:[function(require,module,exports){
var util = require('../util');

function QueryParamSerializer() {
}

QueryParamSerializer.prototype.serialize = function(params, shape, fn) {
  serializeStructure('', params, shape, fn);
};

function ucfirst(shape) {
  if (shape.isQueryName || shape.api.protocol !== 'ec2') {
    return shape.name;
  } else {
    return shape.name[0].toUpperCase() + shape.name.substr(1);
  }
}

function serializeStructure(prefix, struct, rules, fn) {
  util.each(rules.members, function(name, member) {
    var value = struct[name];
    if (value === null || value === undefined) return;

    var memberName = ucfirst(member);
    memberName = prefix ? prefix + '.' + memberName : memberName;
    serializeMember(memberName, value, member, fn);
  });
}

function serializeMap(name, map, rules, fn) {
  var i = 1;
  util.each(map, function (key, value) {
    var prefix = rules.flattened ? '.' : '.entry.';
    var position = prefix + (i++) + '.';
    var keyName = position + (rules.key.name || 'key');
    var valueName = position + (rules.value.name || 'value');
    serializeMember(name + keyName, key, rules.key, fn);
    serializeMember(name + valueName, value, rules.value, fn);
  });
}

function serializeList(name, list, rules, fn) {
  var memberRules = rules.member || {};

  if (list.length === 0) {
    fn.call(this, name, null);
    return;
  }

  util.arrayEach(list, function (v, n) {
    var suffix = '.' + (n + 1);
    if (rules.api.protocol === 'ec2') {
      suffix = suffix + ''; // make linter happy
    } else if (rules.flattened) {
      if (memberRules.name) {
        var parts = name.split('.');
        parts.pop();
        parts.push(ucfirst(memberRules));
        name = parts.join('.');
      }
    } else {
      suffix = '.member' + suffix;
    }
    serializeMember(name + suffix, v, memberRules, fn);
  });
}

function serializeMember(name, value, rules, fn) {
  if (value === null || value === undefined) return;
  if (rules.type === 'structure') {
    serializeStructure(name, value, rules, fn);
  } else if (rules.type === 'list') {
    serializeList(name, value, rules, fn);
  } else if (rules.type === 'map') {
    serializeMap(name, value, rules, fn);
  } else {
    fn(name, rules.toWireFormat(value).toString());
  }
}

module.exports = QueryParamSerializer;

},{"../util":53}],36:[function(require,module,exports){
var util = require('./util');
var regionConfig = require('./region_config.json');

function generateRegionPrefix(region) {
  if (!region) return null;

  var parts = region.split('-');
  if (parts.length < 3) return null;
  return parts.slice(0, parts.length - 2).join('-') + '-*';
}

function derivedKeys(service) {
  var region = service.config.region;
  var regionPrefix = generateRegionPrefix(region);
  var endpointPrefix = service.api.endpointPrefix;

  return [
    [region, endpointPrefix],
    [regionPrefix, endpointPrefix],
    [region, '*'],
    [regionPrefix, '*'],
    ['*', endpointPrefix],
    ['*', '*']
  ].map(function(item) {
    return item[0] && item[1] ? item.join('/') : null;
  });
}

function applyConfig(service, config) {
  util.each(config, function(key, value) {
    if (key === 'globalEndpoint') return;
    if (service.config[key] === undefined || service.config[key] === null) {
      service.config[key] = value;
    }
  });
}

function configureEndpoint(service) {
  var keys = derivedKeys(service);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!key) continue;

    if (Object.prototype.hasOwnProperty.call(regionConfig.rules, key)) {
      var config = regionConfig.rules[key];
      if (typeof config === 'string') {
        config = regionConfig.patterns[config];
      }

      if (service.config.useDualstack && util.isDualstackAvailable(service)) {
        config = util.copy(config);
        config.endpoint = '{service}.dualstack.{region}.amazonaws.com';
      }

      service.isGlobalEndpoint = !!config.globalEndpoint;

      if (!config.signatureVersion) config.signatureVersion = 'v4';

      applyConfig(service, config);
      return;
    }
  }
}

module.exports = configureEndpoint;

},{"./region_config.json":37,"./util":53}],37:[function(require,module,exports){
module.exports={
  "rules": {
    "*/*": {
      "endpoint": "{service}.{region}.amazonaws.com"
    },
    "cn-*/*": {
      "endpoint": "{service}.{region}.amazonaws.com.cn"
    },
    "*/cloudfront": "globalSSL",
    "*/iam": "globalSSL",
    "*/sts": "globalSSL",
    "*/importexport": {
      "endpoint": "{service}.amazonaws.com",
      "signatureVersion": "v2",
      "globalEndpoint": true
    },
    "*/route53": {
      "endpoint": "https://{service}.amazonaws.com",
      "signatureVersion": "v3https",
      "globalEndpoint": true
    },
    "*/waf": "globalSSL",
    "us-gov-*/iam": "globalGovCloud",
    "us-gov-*/sts": {
      "endpoint": "{service}.{region}.amazonaws.com"
    },
    "us-gov-west-1/s3": "s3dash",
    "us-west-1/s3": "s3dash",
    "us-west-2/s3": "s3dash",
    "eu-west-1/s3": "s3dash",
    "ap-southeast-1/s3": "s3dash",
    "ap-southeast-2/s3": "s3dash",
    "ap-northeast-1/s3": "s3dash",
    "sa-east-1/s3": "s3dash",
    "us-east-1/s3": {
      "endpoint": "{service}.amazonaws.com",
      "signatureVersion": "s3"
    },
    "us-east-1/sdb": {
      "endpoint": "{service}.amazonaws.com",
      "signatureVersion": "v2"
    },
    "*/sdb": {
      "endpoint": "{service}.{region}.amazonaws.com",
      "signatureVersion": "v2"
    }
  },

  "patterns": {
    "globalSSL": {
      "endpoint": "https://{service}.amazonaws.com",
      "globalEndpoint": true
    },
    "globalGovCloud": {
      "endpoint": "{service}.us-gov.amazonaws.com"
    },
    "s3dash": {
      "endpoint": "{service}-{region}.amazonaws.com",
      "signatureVersion": "s3"
    }
  }
}

},{}],38:[function(require,module,exports){
(function (process){
var AWS = require('./core');
var AcceptorStateMachine = require('./state_machine');
var inherit = AWS.util.inherit;
var domain = AWS.util.domain;
var jmespath = require('jmespath');


var hardErrorStates = {success: 1, error: 1, complete: 1};

function isTerminalState(machine) {
  return Object.prototype.hasOwnProperty.call(hardErrorStates, machine._asm.currentState);
}

var fsm = new AcceptorStateMachine();
fsm.setupStates = function() {
  var transition = function(_, done) {
    var self = this;
    self._haltHandlersOnError = false;

    self.emit(self._asm.currentState, function(err) {
      if (err) {
        if (isTerminalState(self)) {
          if (domain && self.domain instanceof domain.Domain) {
            err.domainEmitter = self;
            err.domain = self.domain;
            err.domainThrown = false;
            self.domain.emit('error', err);
          } else {
            throw err;
          }
        } else {
          self.response.error = err;
          done(err);
        }
      } else {
        done(self.response.error);
      }
    });

  };

  this.addState('validate', 'build', 'error', transition);
  this.addState('build', 'afterBuild', 'restart', transition);
  this.addState('afterBuild', 'sign', 'restart', transition);
  this.addState('sign', 'send', 'retry', transition);
  this.addState('retry', 'afterRetry', 'afterRetry', transition);
  this.addState('afterRetry', 'sign', 'error', transition);
  this.addState('send', 'validateResponse', 'retry', transition);
  this.addState('validateResponse', 'extractData', 'extractError', transition);
  this.addState('extractError', 'extractData', 'retry', transition);
  this.addState('extractData', 'success', 'retry', transition);
  this.addState('restart', 'build', 'error', transition);
  this.addState('success', 'complete', 'complete', transition);
  this.addState('error', 'complete', 'complete', transition);
  this.addState('complete', null, null, transition);
};
fsm.setupStates();


AWS.Request = inherit({


  constructor: function Request(service, operation, params) {
    var endpoint = service.endpoint;
    var region = service.config.region;
    var customUserAgent = service.config.customUserAgent;

    if (service.isGlobalEndpoint) region = 'us-east-1';

    this.domain = domain && domain.active;
    this.service = service;
    this.operation = operation;
    this.params = params || {};
    this.httpRequest = new AWS.HttpRequest(endpoint, region, customUserAgent);
    this.startTime = AWS.util.date.getDate();

    this.response = new AWS.Response(this);
    this._asm = new AcceptorStateMachine(fsm.states, 'validate');
    this._haltHandlersOnError = false;

    AWS.SequentialExecutor.call(this);
    this.emit = this.emitEvent;
  },




  send: function send(callback) {
    if (callback) {
      this.on('complete', function (resp) {
        callback.call(resp, resp.error, resp.data);
      });
    }
    this.runTo();

    return this.response;
  },




  build: function build(callback) {
    return this.runTo('send', callback);
  },


  runTo: function runTo(state, done) {
    this._asm.runTo(state, done, this);
    return this;
  },


  abort: function abort() {
    this.removeAllListeners('validateResponse');
    this.removeAllListeners('extractError');
    this.on('validateResponse', function addAbortedError(resp) {
      resp.error = AWS.util.error(new Error('Request aborted by user'), {
         code: 'RequestAbortedError', retryable: false
      });
    });

    if (this.httpRequest.stream) { // abort HTTP stream
      this.httpRequest.stream.abort();
      if (this.httpRequest._abortCallback) {
         this.httpRequest._abortCallback();
      } else {
        this.removeAllListeners('send'); // haven't sent yet, so let's not
      }
    }

    return this;
  },


  eachPage: function eachPage(callback) {
    callback = AWS.util.fn.makeAsync(callback, 3);

    function wrappedCallback(response) {
      callback.call(response, response.error, response.data, function (result) {
        if (result === false) return;

        if (response.hasNextPage()) {
          response.nextPage().on('complete', wrappedCallback).send();
        } else {
          callback.call(response, null, null, AWS.util.fn.noop);
        }
      });
    }

    this.on('complete', wrappedCallback).send();
  },


  eachItem: function eachItem(callback) {
    var self = this;
    function wrappedCallback(err, data) {
      if (err) return callback(err, null);
      if (data === null) return callback(null, null);

      var config = self.service.paginationConfig(self.operation);
      var resultKey = config.resultKey;
      if (Array.isArray(resultKey)) resultKey = resultKey[0];
      var items = jmespath.search(data, resultKey);
      var continueIteration = true;
      AWS.util.arrayEach(items, function(item) {
        continueIteration = callback(null, item);
        if (continueIteration === false) {
          return AWS.util.abort;
        }
      });
      return continueIteration;
    }

    this.eachPage(wrappedCallback);
  },


  isPageable: function isPageable() {
    return this.service.paginationConfig(this.operation) ? true : false;
  },


  createReadStream: function createReadStream() {
    var streams = AWS.util.stream;
    var req = this;
    var stream = null;

    if (AWS.HttpClient.streamsApiVersion === 2) {
      stream = new streams.PassThrough();
      req.send();
    } else {
      stream = new streams.Stream();
      stream.readable = true;

      stream.sent = false;
      stream.on('newListener', function(event) {
        if (!stream.sent && event === 'data') {
          stream.sent = true;
          process.nextTick(function() { req.send(); });
        }
      });
    }

    this.on('httpHeaders', function streamHeaders(statusCode, headers, resp) {
      if (statusCode < 300) {
        req.removeListener('httpData', AWS.EventListeners.Core.HTTP_DATA);
        req.removeListener('httpError', AWS.EventListeners.Core.HTTP_ERROR);
        req.on('httpError', function streamHttpError(error) {
          resp.error = error;
          resp.error.retryable = false;
        });

        var shouldCheckContentLength = false;
        var expectedLen;
        if (req.httpRequest.method !== 'HEAD') {
          expectedLen = parseInt(headers['content-length'], 10);
        }
        if (expectedLen !== undefined && !isNaN(expectedLen) && expectedLen >= 0) {
          shouldCheckContentLength = true;
          var receivedLen = 0;
        }

        var checkContentLengthAndEmit = function checkContentLengthAndEmit() {
          if (shouldCheckContentLength && receivedLen !== expectedLen) {
            stream.emit('error', AWS.util.error(
              new Error('Stream content length mismatch. Received ' +
                receivedLen + ' of ' + expectedLen + ' bytes.'),
              { code: 'StreamContentLengthMismatch' }
            ));
          } else if (AWS.HttpClient.streamsApiVersion === 2) {
            stream.end();
          } else {
            stream.emit('end')
          }
        }

        var httpStream = resp.httpResponse.createUnbufferedStream();

        if (AWS.HttpClient.streamsApiVersion === 2) {
          if (shouldCheckContentLength) {
            var lengthAccumulator = new streams.PassThrough();
            lengthAccumulator._write = function(chunk) {
              if (chunk && chunk.length) {
                receivedLen += chunk.length;
              }
              return streams.PassThrough.prototype._write.apply(this, arguments);
            };

            lengthAccumulator.on('end', checkContentLengthAndEmit);
            httpStream.pipe(lengthAccumulator).pipe(stream, { end: false });
          } else {
            httpStream.pipe(stream);
          }
        } else {

          if (shouldCheckContentLength) {
            httpStream.on('data', function(arg) {
              if (arg && arg.length) {
                receivedLen += arg.length;
              }
            });
          }

          httpStream.on('data', function(arg) {
            stream.emit('data', arg);
          });
          httpStream.on('end', checkContentLengthAndEmit);
        }

        httpStream.on('error', function(err) {
          shouldCheckContentLength = false;
          stream.emit('error', err);
        });
      }
    });

    this.on('error', function(err) {
      stream.emit('error', err);
    });

    return stream;
  },


  emitEvent: function emit(eventName, args, done) {
    if (typeof args === 'function') { done = args; args = null; }
    if (!done) done = function() { };
    if (!args) args = this.eventParameters(eventName, this.response);

    var origEmit = AWS.SequentialExecutor.prototype.emit;
    origEmit.call(this, eventName, args, function (err) {
      if (err) this.response.error = err;
      done.call(this, err);
    });
  },


  eventParameters: function eventParameters(eventName) {
    switch (eventName) {
      case 'restart':
      case 'validate':
      case 'sign':
      case 'build':
      case 'afterValidate':
      case 'afterBuild':
        return [this];
      case 'error':
        return [this.response.error, this.response];
      default:
        return [this.response];
    }
  },


  presign: function presign(expires, callback) {
    if (!callback && typeof expires === 'function') {
      callback = expires;
      expires = null;
    }
    return new AWS.Signers.Presign().sign(this.toGet(), expires, callback);
  },


  isPresigned: function isPresigned() {
    return Object.prototype.hasOwnProperty.call(this.httpRequest.headers, 'presigned-expires');
  },


  toUnauthenticated: function toUnauthenticated() {
    this.removeListener('validate', AWS.EventListeners.Core.VALIDATE_CREDENTIALS);
    this.removeListener('sign', AWS.EventListeners.Core.SIGN);
    return this;
  },


  toGet: function toGet() {
    if (this.service.api.protocol === 'query' ||
        this.service.api.protocol === 'ec2') {
      this.removeListener('build', this.buildAsGet);
      this.addListener('build', this.buildAsGet);
    }
    return this;
  },


  buildAsGet: function buildAsGet(request) {
    request.httpRequest.method = 'GET';
    request.httpRequest.path = request.service.endpoint.path +
                               '?' + request.httpRequest.body;
    request.httpRequest.body = '';

    delete request.httpRequest.headers['Content-Length'];
    delete request.httpRequest.headers['Content-Type'];
  },


  haltHandlersOnError: function haltHandlersOnError() {
    this._haltHandlersOnError = true;
  }
});

AWS.util.addPromisesToRequests(AWS.Request);

AWS.util.mixin(AWS.Request, AWS.SequentialExecutor);

}).call(this,require("FWaASH"))
},{"./core":11,"./state_machine":52,"FWaASH":62,"jmespath":79}],39:[function(require,module,exports){


var AWS = require('./core');
var inherit = AWS.util.inherit;
var jmespath = require('jmespath');


function CHECK_ACCEPTORS(resp) {
  var waiter = resp.request._waiter;
  var acceptors = waiter.config.acceptors;
  var acceptorMatched = false;
  var state = 'retry';

  acceptors.forEach(function(acceptor) {
    if (!acceptorMatched) {
      var matcher = waiter.matchers[acceptor.matcher];
      if (matcher && matcher(resp, acceptor.expected, acceptor.argument)) {
        acceptorMatched = true;
        state = acceptor.state;
      }
    }
  });

  if (!acceptorMatched && resp.error) state = 'failure';

  if (state === 'success') {
    waiter.setSuccess(resp);
  } else {
    waiter.setError(resp, state === 'retry');
  }
}


AWS.ResourceWaiter = inherit({

  constructor: function constructor(service, state) {
    this.service = service;
    this.state = state;
    this.loadWaiterConfig(this.state);
  },

  service: null,

  state: null,

  config: null,

  matchers: {
    path: function(resp, expected, argument) {
      var result = jmespath.search(resp.data, argument);
      return jmespath.strictDeepEqual(result,expected);
    },

    pathAll: function(resp, expected, argument) {
      var results = jmespath.search(resp.data, argument);
      if (!Array.isArray(results)) results = [results];
      var numResults = results.length;
      if (!numResults) return false;
      for (var ind = 0 ; ind < numResults; ind++) {
        if (!jmespath.strictDeepEqual(results[ind], expected)) {
          return false;
        }
      }
      return true;
    },

    pathAny: function(resp, expected, argument) {
      var results = jmespath.search(resp.data, argument);
      if (!Array.isArray(results)) results = [results];
      var numResults = results.length;
      for (var ind = 0 ; ind < numResults; ind++) {
        if (jmespath.strictDeepEqual(results[ind], expected)) {
          return true;
        }
      }
      return false;
    },

    status: function(resp, expected) {
      var statusCode = resp.httpResponse.statusCode;
      return (typeof statusCode === 'number') && (statusCode === expected);
    },

    error: function(resp, expected) {
      if (typeof expected === 'string' && resp.error) {
        return expected === resp.error.code;
      }
      return expected === !!resp.error;
    }
  },

  listeners: new AWS.SequentialExecutor().addNamedListeners(function(add) {
    add('RETRY_CHECK', 'retry', function(resp) {
      var waiter = resp.request._waiter;
      if (resp.error && resp.error.code === 'ResourceNotReady') {
        resp.error.retryDelay = (waiter.config.delay || 0) * 1000;
      }
    });

    add('CHECK_OUTPUT', 'extractData', CHECK_ACCEPTORS);

    add('CHECK_ERROR', 'extractError', CHECK_ACCEPTORS);
  }),


  wait: function wait(params, callback) {
    if (typeof params === 'function') {
      callback = params; params = undefined;
    }

    var request = this.service.makeRequest(this.config.operation, params);
    request._waiter = this;
    request.response.maxRetries = this.config.maxAttempts;
    request.addListeners(this.listeners);

    if (callback) request.send(callback);
    return request;
  },

  setSuccess: function setSuccess(resp) {
    resp.error = null;
    resp.data = resp.data || {};
    resp.request.removeAllListeners('extractData');
  },

  setError: function setError(resp, retryable) {
    resp.data = null;
    resp.error = AWS.util.error(resp.error || new Error(), {
      code: 'ResourceNotReady',
      message: 'Resource is not in the state ' + this.state,
      retryable: retryable
    });
  },


  loadWaiterConfig: function loadWaiterConfig(state) {
    if (!this.service.api.waiters[state]) {
      throw new AWS.util.error(new Error(), {
        code: 'StateNotFoundError',
        message: 'State ' + state + ' not found.'
      });
    }

    this.config = this.service.api.waiters[state];
  }
});

},{"./core":11,"jmespath":79}],40:[function(require,module,exports){
var AWS = require('./core');
var inherit = AWS.util.inherit;
var jmespath = require('jmespath');


AWS.Response = inherit({


  constructor: function Response(request) {
    this.request = request;
    this.data = null;
    this.error = null;
    this.retryCount = 0;
    this.redirectCount = 0;
    this.httpResponse = new AWS.HttpResponse();
    if (request) {
      this.maxRetries = request.service.numRetries();
      this.maxRedirects = request.service.config.maxRedirects;
    }
  },


  nextPage: function nextPage(callback) {
    var config;
    var service = this.request.service;
    var operation = this.request.operation;
    try {
      config = service.paginationConfig(operation, true);
    } catch (e) { this.error = e; }

    if (!this.hasNextPage()) {
      if (callback) callback(this.error, null);
      else if (this.error) throw this.error;
      return null;
    }

    var params = AWS.util.copy(this.request.params);
    if (!this.nextPageTokens) {
      return callback ? callback(null, null) : null;
    } else {
      var inputTokens = config.inputToken;
      if (typeof inputTokens === 'string') inputTokens = [inputTokens];
      for (var i = 0; i < inputTokens.length; i++) {
        params[inputTokens[i]] = this.nextPageTokens[i];
      }
      return service.makeRequest(this.request.operation, params, callback);
    }
  },


  hasNextPage: function hasNextPage() {
    this.cacheNextPageTokens();
    if (this.nextPageTokens) return true;
    if (this.nextPageTokens === undefined) return undefined;
    else return false;
  },


  cacheNextPageTokens: function cacheNextPageTokens() {
    if (Object.prototype.hasOwnProperty.call(this, 'nextPageTokens')) return this.nextPageTokens;
    this.nextPageTokens = undefined;

    var config = this.request.service.paginationConfig(this.request.operation);
    if (!config) return this.nextPageTokens;

    this.nextPageTokens = null;
    if (config.moreResults) {
      if (!jmespath.search(this.data, config.moreResults)) {
        return this.nextPageTokens;
      }
    }

    var exprs = config.outputToken;
    if (typeof exprs === 'string') exprs = [exprs];
    AWS.util.arrayEach.call(this, exprs, function (expr) {
      var output = jmespath.search(this.data, expr);
      if (output) {
        this.nextPageTokens = this.nextPageTokens || [];
        this.nextPageTokens.push(output);
      }
    });

    return this.nextPageTokens;
  }

});

},{"./core":11,"jmespath":79}],41:[function(require,module,exports){
var AWS = require('./core');


AWS.SequentialExecutor = AWS.util.inherit({

  constructor: function SequentialExecutor() {
    this._events = {};
  },


  listeners: function listeners(eventName) {
    return this._events[eventName] ? this._events[eventName].slice(0) : [];
  },

  on: function on(eventName, listener) {
    if (this._events[eventName]) {
      this._events[eventName].push(listener);
    } else {
      this._events[eventName] = [listener];
    }
    return this;
  },


  onAsync: function onAsync(eventName, listener) {
    listener._isAsync = true;
    return this.on(eventName, listener);
  },

  removeListener: function removeListener(eventName, listener) {
    var listeners = this._events[eventName];
    if (listeners) {
      var length = listeners.length;
      var position = -1;
      for (var i = 0; i < length; ++i) {
        if (listeners[i] === listener) {
          position = i;
        }
      }
      if (position > -1) {
        listeners.splice(position, 1);
      }
    }
    return this;
  },

  removeAllListeners: function removeAllListeners(eventName) {
    if (eventName) {
      delete this._events[eventName];
    } else {
      this._events = {};
    }
    return this;
  },


  emit: function emit(eventName, eventArgs, doneCallback) {
    if (!doneCallback) doneCallback = function() { };
    var listeners = this.listeners(eventName);
    var count = listeners.length;
    this.callListeners(listeners, eventArgs, doneCallback);
    return count > 0;
  },


  callListeners: function callListeners(listeners, args, doneCallback, prevError) {
    var self = this;
    var error = prevError || null;

    function callNextListener(err) {
      if (err) {
        error = AWS.util.error(error || new Error(), err);
        if (self._haltHandlersOnError) {
          return doneCallback.call(self, error);
        }
      }
      self.callListeners(listeners, args, doneCallback, error);
    }

    while (listeners.length > 0) {
      var listener = listeners.shift();
      if (listener._isAsync) { // asynchronous listener
        listener.apply(self, args.concat([callNextListener]));
        return; // stop here, callNextListener will continue
      } else { // synchronous listener
        try {
          listener.apply(self, args);
        } catch (err) {
          error = AWS.util.error(error || new Error(), err);
        }
        if (error && self._haltHandlersOnError) {
          doneCallback.call(self, error);
          return;
        }
      }
    }
    doneCallback.call(self, error);
  },


  addListeners: function addListeners(listeners) {
    var self = this;

    if (listeners._events) listeners = listeners._events;

    AWS.util.each(listeners, function(event, callbacks) {
      if (typeof callbacks === 'function') callbacks = [callbacks];
      AWS.util.arrayEach(callbacks, function(callback) {
        self.on(event, callback);
      });
    });

    return self;
  },


  addNamedListener: function addNamedListener(name, eventName, callback) {
    this[name] = callback;
    this.addListener(eventName, callback);
    return this;
  },


  addNamedAsyncListener: function addNamedAsyncListener(name, eventName, callback) {
    callback._isAsync = true;
    return this.addNamedListener(name, eventName, callback);
  },


  addNamedListeners: function addNamedListeners(callback) {
    var self = this;
    callback(
      function() {
        self.addNamedListener.apply(self, arguments);
      },
      function() {
        self.addNamedAsyncListener.apply(self, arguments);
      }
    );
    return this;
  }
});


AWS.SequentialExecutor.prototype.addListener = AWS.SequentialExecutor.prototype.on;

module.exports = AWS.SequentialExecutor;

},{"./core":11}],42:[function(require,module,exports){
var AWS = require('./core');
var Api = require('./model/api');
var regionConfig = require('./region_config');
var inherit = AWS.util.inherit;
var clientCount = 0;


AWS.Service = inherit({

  constructor: function Service(config) {
    if (!this.loadServiceClass) {
      throw AWS.util.error(new Error(),
        'Service must be constructed with `new\' operator');
    }
    var ServiceClass = this.loadServiceClass(config || {});
    if (ServiceClass) {
      var originalConfig = AWS.util.copy(config);
      var svc = new ServiceClass(config);
      Object.defineProperty(svc, '_originalConfig', {
        get: function() { return originalConfig; },
        enumerable: false,
        configurable: true
      });
      svc._clientId = ++clientCount;
      return svc;
    }
    this.initialize(config);
  },


  initialize: function initialize(config) {
    var svcConfig = AWS.config[this.serviceIdentifier];

    this.config = new AWS.Config(AWS.config);
    if (svcConfig) this.config.update(svcConfig, true);
    if (config) this.config.update(config, true);

    this.validateService();
    if (!this.config.endpoint) regionConfig(this);

    this.config.endpoint = this.endpointFromTemplate(this.config.endpoint);
    this.setEndpoint(this.config.endpoint);
  },


  validateService: function validateService() {
  },


  loadServiceClass: function loadServiceClass(serviceConfig) {
    var config = serviceConfig;
    if (!AWS.util.isEmpty(this.api)) {
      return null;
    } else if (config.apiConfig) {
      return AWS.Service.defineServiceApi(this.constructor, config.apiConfig);
    } else if (!this.constructor.services) {
      return null;
    } else {
      config = new AWS.Config(AWS.config);
      config.update(serviceConfig, true);
      var version = config.apiVersions[this.constructor.serviceIdentifier];
      version = version || config.apiVersion;
      return this.getLatestServiceClass(version);
    }
  },


  getLatestServiceClass: function getLatestServiceClass(version) {
    version = this.getLatestServiceVersion(version);
    if (this.constructor.services[version] === null) {
      AWS.Service.defineServiceApi(this.constructor, version);
    }

    return this.constructor.services[version];
  },


  getLatestServiceVersion: function getLatestServiceVersion(version) {
    if (!this.constructor.services || this.constructor.services.length === 0) {
      throw new Error('No services defined on ' +
                      this.constructor.serviceIdentifier);
    }

    if (!version) {
      version = 'latest';
    } else if (AWS.util.isType(version, Date)) {
      version = AWS.util.date.iso8601(version).split('T')[0];
    }

    if (Object.hasOwnProperty(this.constructor.services, version)) {
      return version;
    }

    var keys = Object.keys(this.constructor.services).sort();
    var selectedVersion = null;
    for (var i = keys.length - 1; i >= 0; i--) {
      if (keys[i][keys[i].length - 1] !== '*') {
        selectedVersion = keys[i];
      }
      if (keys[i].substr(0, 10) <= version) {
        return selectedVersion;
      }
    }

    throw new Error('Could not find ' + this.constructor.serviceIdentifier +
                    ' API to satisfy version constraint `' + version + '\'');
  },


  api: {},


  defaultRetryCount: 3,


  makeRequest: function makeRequest(operation, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = null;
    }

    params = params || {};
    if (this.config.params) { // copy only toplevel bound params
      var rules = this.api.operations[operation];
      if (rules) {
        params = AWS.util.copy(params);
        AWS.util.each(this.config.params, function(key, value) {
          if (rules.input.members[key]) {
            if (params[key] === undefined || params[key] === null) {
              params[key] = value;
            }
          }
        });
      }
    }

    var request = new AWS.Request(this, operation, params);
    this.addAllRequestListeners(request);

    if (callback) request.send(callback);
    return request;
  },


  makeUnauthenticatedRequest: function makeUnauthenticatedRequest(operation, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    var request = this.makeRequest(operation, params).toUnauthenticated();
    return callback ? request.send(callback) : request;
  },


  waitFor: function waitFor(state, params, callback) {
    var waiter = new AWS.ResourceWaiter(this, state);
    return waiter.wait(params, callback);
  },


  addAllRequestListeners: function addAllRequestListeners(request) {
    var list = [AWS.events, AWS.EventListeners.Core, this.serviceInterface(),
                AWS.EventListeners.CorePost];
    for (var i = 0; i < list.length; i++) {
      if (list[i]) request.addListeners(list[i]);
    }

    if (!this.config.paramValidation) {
      request.removeListener('validate',
        AWS.EventListeners.Core.VALIDATE_PARAMETERS);
    }

    if (this.config.logger) { // add logging events
      request.addListeners(AWS.EventListeners.Logger);
    }

    this.setupRequestListeners(request);
  },


  setupRequestListeners: function setupRequestListeners() {
  },


  getSignerClass: function getSignerClass() {
    var version;
    if (this.config.signatureVersion) {
      version = this.config.signatureVersion;
    } else {
      version = this.api.signatureVersion;
    }
    return AWS.Signers.RequestSigner.getVersion(version);
  },


  serviceInterface: function serviceInterface() {
    switch (this.api.protocol) {
      case 'ec2': return AWS.EventListeners.Query;
      case 'query': return AWS.EventListeners.Query;
      case 'json': return AWS.EventListeners.Json;
      case 'rest-json': return AWS.EventListeners.RestJson;
      case 'rest-xml': return AWS.EventListeners.RestXml;
    }
    if (this.api.protocol) {
      throw new Error('Invalid service `protocol\' ' +
        this.api.protocol + ' in API config');
    }
  },


  successfulResponse: function successfulResponse(resp) {
    return resp.httpResponse.statusCode < 300;
  },


  numRetries: function numRetries() {
    if (this.config.maxRetries !== undefined) {
      return this.config.maxRetries;
    } else {
      return this.defaultRetryCount;
    }
  },


  retryDelays: function retryDelays(retryCount) {
    return AWS.util.calculateRetryDelay(retryCount, this.config.retryDelayOptions);
  },


  retryableError: function retryableError(error) {
    if (this.networkingError(error)) return true;
    if (this.expiredCredentialsError(error)) return true;
    if (this.throttledError(error)) return true;
    if (error.statusCode >= 500) return true;
    return false;
  },


  networkingError: function networkingError(error) {
    return error.code === 'NetworkingError';
  },


  expiredCredentialsError: function expiredCredentialsError(error) {
    return (error.code === 'ExpiredTokenException');
  },


  clockSkewError: function clockSkewError(error) {
    switch (error.code) {
      case 'RequestTimeTooSkewed':
      case 'RequestExpired':
      case 'InvalidSignatureException':
      case 'SignatureDoesNotMatch':
      case 'AuthFailure':
      case 'RequestInTheFuture':
        return true;
      default: return false;
    }
  },


  throttledError: function throttledError(error) {
    switch (error.code) {
      case 'ProvisionedThroughputExceededException':
      case 'Throttling':
      case 'ThrottlingException':
      case 'RequestLimitExceeded':
      case 'RequestThrottled':
        return true;
      default:
        return false;
    }
  },


  endpointFromTemplate: function endpointFromTemplate(endpoint) {
    if (typeof endpoint !== 'string') return endpoint;

    var e = endpoint;
    e = e.replace(/\{service\}/g, this.api.endpointPrefix);
    e = e.replace(/\{region\}/g, this.config.region);
    e = e.replace(/\{scheme\}/g, this.config.sslEnabled ? 'https' : 'http');
    return e;
  },


  setEndpoint: function setEndpoint(endpoint) {
    this.endpoint = new AWS.Endpoint(endpoint, this.config);
  },


  paginationConfig: function paginationConfig(operation, throwException) {
    var paginator = this.api.operations[operation].paginator;
    if (!paginator) {
      if (throwException) {
        var e = new Error();
        throw AWS.util.error(e, 'No pagination configuration for ' + operation);
      }
      return null;
    }

    return paginator;
  }
});

AWS.util.update(AWS.Service, {


  defineMethods: function defineMethods(svc) {
    AWS.util.each(svc.prototype.api.operations, function iterator(method) {
      if (svc.prototype[method]) return;
      var operation = svc.prototype.api.operations[method];
      if (operation.authtype === 'none') {
        svc.prototype[method] = function (params, callback) {
          return this.makeUnauthenticatedRequest(method, params, callback);
        };
      } else {
        svc.prototype[method] = function (params, callback) {
          return this.makeRequest(method, params, callback);
        };
      }
    });
  },


  defineService: function defineService(serviceIdentifier, versions, features) {
    AWS.Service._serviceMap[serviceIdentifier] = true;
    if (!Array.isArray(versions)) {
      features = versions;
      versions = [];
    }

    var svc = inherit(AWS.Service, features || {});

    if (typeof serviceIdentifier === 'string') {
      AWS.Service.addVersions(svc, versions);

      var identifier = svc.serviceIdentifier || serviceIdentifier;
      svc.serviceIdentifier = identifier;
    } else { // defineService called with an API
      svc.prototype.api = serviceIdentifier;
      AWS.Service.defineMethods(svc);
    }

    return svc;
  },


  addVersions: function addVersions(svc, versions) {
    if (!Array.isArray(versions)) versions = [versions];

    svc.services = svc.services || {};
    for (var i = 0; i < versions.length; i++) {
      if (svc.services[versions[i]] === undefined) {
        svc.services[versions[i]] = null;
      }
    }

    svc.apiVersions = Object.keys(svc.services).sort();
  },


  defineServiceApi: function defineServiceApi(superclass, version, apiConfig) {
    var svc = inherit(superclass, {
      serviceIdentifier: superclass.serviceIdentifier
    });

    function setApi(api) {
      if (api.isApi) {
        svc.prototype.api = api;
      } else {
        svc.prototype.api = new Api(api);
      }
    }

    if (typeof version === 'string') {
      if (apiConfig) {
        setApi(apiConfig);
      } else {
        try {
          setApi(AWS.apiLoader(superclass.serviceIdentifier, version));
        } catch (err) {
          throw AWS.util.error(err, {
            message: 'Could not find API configuration ' +
              superclass.serviceIdentifier + '-' + version
          });
        }
      }
      if (!Object.prototype.hasOwnProperty.call(superclass.services, version)) {
        superclass.apiVersions = superclass.apiVersions.concat(version).sort();
      }
      superclass.services[version] = svc;
    } else {
      setApi(version);
    }

    AWS.Service.defineMethods(svc);
    return svc;
  },


  hasService: function(identifier) {
    return Object.prototype.hasOwnProperty.call(AWS.Service._serviceMap, identifier);
  },


  _serviceMap: {}
});

module.exports = AWS.Service;
},{"./core":11,"./model/api":23,"./region_config":36}],43:[function(require,module,exports){
var AWS = require('../core');

AWS.util.update(AWS.CognitoIdentity.prototype, {
  getOpenIdToken: function getOpenIdToken(params, callback) {
    return this.makeUnauthenticatedRequest('getOpenIdToken', params, callback);
  },

  getId: function getId(params, callback) {
    return this.makeUnauthenticatedRequest('getId', params, callback);
  },

  getCredentialsForIdentity: function getCredentialsForIdentity(params, callback) {
    return this.makeUnauthenticatedRequest('getCredentialsForIdentity', params, callback);
  }
});

},{"../core":11}],44:[function(require,module,exports){
var AWS = require('../core');

AWS.util.update(AWS.STS.prototype, {

  credentialsFrom: function credentialsFrom(data, credentials) {
    if (!data) return null;
    if (!credentials) credentials = new AWS.TemporaryCredentials();
    credentials.expired = false;
    credentials.accessKeyId = data.Credentials.AccessKeyId;
    credentials.secretAccessKey = data.Credentials.SecretAccessKey;
    credentials.sessionToken = data.Credentials.SessionToken;
    credentials.expireTime = data.Credentials.Expiration;
    return credentials;
  },

  assumeRoleWithWebIdentity: function assumeRoleWithWebIdentity(params, callback) {
    return this.makeUnauthenticatedRequest('assumeRoleWithWebIdentity', params, callback);
  },

  assumeRoleWithSAML: function assumeRoleWithSAML(params, callback) {
    return this.makeUnauthenticatedRequest('assumeRoleWithSAML', params, callback);
  }
});

},{"../core":11}],45:[function(require,module,exports){
var AWS = require('../core');
var inherit = AWS.util.inherit;


var expiresHeader = 'presigned-expires';


function signedUrlBuilder(request) {
  var expires = request.httpRequest.headers[expiresHeader];
  var signerClass = request.service.getSignerClass(request);

  delete request.httpRequest.headers['User-Agent'];
  delete request.httpRequest.headers['X-Amz-User-Agent'];

  if (signerClass === AWS.Signers.V4) {
    if (expires > 604800) { // one week expiry is invalid
      var message = 'Presigning does not support expiry time greater ' +
                    'than a week with SigV4 signing.';
      throw AWS.util.error(new Error(), {
        code: 'InvalidExpiryTime', message: message, retryable: false
      });
    }
    request.httpRequest.headers[expiresHeader] = expires;
  } else if (signerClass === AWS.Signers.S3) {
    request.httpRequest.headers[expiresHeader] = parseInt(
      AWS.util.date.unixTimestamp() + expires, 10).toString();
  } else {
    throw AWS.util.error(new Error(), {
      message: 'Presigning only supports S3 or SigV4 signing.',
      code: 'UnsupportedSigner', retryable: false
    });
  }
}


function signedUrlSigner(request) {
  var endpoint = request.httpRequest.endpoint;
  var parsedUrl = AWS.util.urlParse(request.httpRequest.path);
  var queryParams = {};

  if (parsedUrl.search) {
    queryParams = AWS.util.queryStringParse(parsedUrl.search.substr(1));
  }

  AWS.util.each(request.httpRequest.headers, function (key, value) {
    if (key === expiresHeader) key = 'Expires';
    if (key.indexOf('x-amz-meta-') === 0) {
      delete queryParams[key];
      key = key.toLowerCase();
    }
    queryParams[key] = value;
  });
  delete request.httpRequest.headers[expiresHeader];

  var auth = queryParams['Authorization'].split(' ');
  if (auth[0] === 'AWS') {
    auth = auth[1].split(':');
    queryParams['AWSAccessKeyId'] = auth[0];
    queryParams['Signature'] = auth[1];
  } else if (auth[0] === 'AWS4-HMAC-SHA256') { // SigV4 signing
    auth.shift();
    var rest = auth.join(' ');
    var signature = rest.match(/Signature=(.*?)(?:,|\s|\r?\n|$)/)[1];
    queryParams['X-Amz-Signature'] = signature;
    delete queryParams['Expires'];
  }
  delete queryParams['Authorization'];
  delete queryParams['Host'];

  endpoint.pathname = parsedUrl.pathname;
  endpoint.search = AWS.util.queryParamsToString(queryParams);
}


AWS.Signers.Presign = inherit({

  sign: function sign(request, expireTime, callback) {
    request.httpRequest.headers[expiresHeader] = expireTime || 3600;
    request.on('build', signedUrlBuilder);
    request.on('sign', signedUrlSigner);
    request.removeListener('afterBuild',
      AWS.EventListeners.Core.SET_CONTENT_LENGTH);
    request.removeListener('afterBuild',
      AWS.EventListeners.Core.COMPUTE_SHA256);

    request.emit('beforePresign', [request]);

    if (callback) {
      request.build(function() {
        if (this.response.error) callback(this.response.error);
        else {
          callback(null, AWS.util.urlFormat(request.httpRequest.endpoint));
        }
      });
    } else {
      request.build();
      if (request.response.error) throw request.response.error;
      return AWS.util.urlFormat(request.httpRequest.endpoint);
    }
  }
});

module.exports = AWS.Signers.Presign;

},{"../core":11}],46:[function(require,module,exports){
var AWS = require('../core');
var inherit = AWS.util.inherit;


AWS.Signers.RequestSigner = inherit({
  constructor: function RequestSigner(request) {
    this.request = request;
  },

  setServiceClientId: function setServiceClientId(id) {
    this.serviceClientId = id;
  },

  getServiceClientId: function getServiceClientId() {
    return this.serviceClientId;
  }
});

AWS.Signers.RequestSigner.getVersion = function getVersion(version) {
  switch (version) {
    case 'v2': return AWS.Signers.V2;
    case 'v3': return AWS.Signers.V3;
    case 'v4': return AWS.Signers.V4;
    case 's3': return AWS.Signers.S3;
    case 'v3https': return AWS.Signers.V3Https;
  }
  throw new Error('Unknown signing version ' + version);
};

require('./v2');
require('./v3');
require('./v3https');
require('./v4');
require('./s3');
require('./presign');

},{"../core":11,"./presign":45,"./s3":47,"./v2":48,"./v3":49,"./v3https":50,"./v4":51}],47:[function(require,module,exports){
var AWS = require('../core');
var inherit = AWS.util.inherit;


AWS.Signers.S3 = inherit(AWS.Signers.RequestSigner, {

  subResources: {
    'acl': 1,
    'accelerate': 1,
    'cors': 1,
    'lifecycle': 1,
    'delete': 1,
    'location': 1,
    'logging': 1,
    'notification': 1,
    'partNumber': 1,
    'policy': 1,
    'requestPayment': 1,
    'replication': 1,
    'restore': 1,
    'tagging': 1,
    'torrent': 1,
    'uploadId': 1,
    'uploads': 1,
    'versionId': 1,
    'versioning': 1,
    'versions': 1,
    'website': 1
  },

  responseHeaders: {
    'response-content-type': 1,
    'response-content-language': 1,
    'response-expires': 1,
    'response-cache-control': 1,
    'response-content-disposition': 1,
    'response-content-encoding': 1
  },

  addAuthorization: function addAuthorization(credentials, date) {
    if (!this.request.headers['presigned-expires']) {
      this.request.headers['X-Amz-Date'] = AWS.util.date.rfc822(date);
    }

    if (credentials.sessionToken) {
      this.request.headers['x-amz-security-token'] = credentials.sessionToken;
    }

    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());
    var auth = 'AWS ' + credentials.accessKeyId + ':' + signature;

    this.request.headers['Authorization'] = auth;
  },

  stringToSign: function stringToSign() {
    var r = this.request;

    var parts = [];
    parts.push(r.method);
    parts.push(r.headers['Content-MD5'] || '');
    parts.push(r.headers['Content-Type'] || '');

    parts.push(r.headers['presigned-expires'] || '');

    var headers = this.canonicalizedAmzHeaders();
    if (headers) parts.push(headers);
    parts.push(this.canonicalizedResource());

    return parts.join('\n');

  },

  canonicalizedAmzHeaders: function canonicalizedAmzHeaders() {

    var amzHeaders = [];

    AWS.util.each(this.request.headers, function (name) {
      if (name.match(/^x-amz-/i))
        amzHeaders.push(name);
    });

    amzHeaders.sort(function (a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    var parts = [];
    AWS.util.arrayEach.call(this, amzHeaders, function (name) {
      parts.push(name.toLowerCase() + ':' + String(this.request.headers[name]));
    });

    return parts.join('\n');

  },

  canonicalizedResource: function canonicalizedResource() {

    var r = this.request;

    var parts = r.path.split('?');
    var path = parts[0];
    var querystring = parts[1];

    var resource = '';

    if (r.virtualHostedBucket)
      resource += '/' + r.virtualHostedBucket;

    resource += path;

    if (querystring) {

      var resources = [];

      AWS.util.arrayEach.call(this, querystring.split('&'), function (param) {
        var name = param.split('=')[0];
        var value = param.split('=')[1];
        if (this.subResources[name] || this.responseHeaders[name]) {
          var subresource = { name: name };
          if (value !== undefined) {
            if (this.subResources[name]) {
              subresource.value = value;
            } else {
              subresource.value = decodeURIComponent(value);
            }
          }
          resources.push(subresource);
        }
      });

      resources.sort(function (a, b) { return a.name < b.name ? -1 : 1; });

      if (resources.length) {

        querystring = [];
        AWS.util.arrayEach(resources, function (res) {
          if (res.value === undefined) {
            querystring.push(res.name);
          } else {
            querystring.push(res.name + '=' + res.value);
          }
        });

        resource += '?' + querystring.join('&');
      }

    }

    return resource;

  },

  sign: function sign(secret, string) {
    return AWS.util.crypto.hmac(secret, string, 'base64', 'sha1');
  }
});

module.exports = AWS.Signers.S3;

},{"../core":11}],48:[function(require,module,exports){
var AWS = require('../core');
var inherit = AWS.util.inherit;


AWS.Signers.V2 = inherit(AWS.Signers.RequestSigner, {
  addAuthorization: function addAuthorization(credentials, date) {

    if (!date) date = AWS.util.date.getDate();

    var r = this.request;

    r.params.Timestamp = AWS.util.date.iso8601(date);
    r.params.SignatureVersion = '2';
    r.params.SignatureMethod = 'HmacSHA256';
    r.params.AWSAccessKeyId = credentials.accessKeyId;

    if (credentials.sessionToken) {
      r.params.SecurityToken = credentials.sessionToken;
    }

    delete r.params.Signature; // delete old Signature for re-signing
    r.params.Signature = this.signature(credentials);

    r.body = AWS.util.queryParamsToString(r.params);
    r.headers['Content-Length'] = r.body.length;
  },

  signature: function signature(credentials) {
    return AWS.util.crypto.hmac(credentials.secretAccessKey, this.stringToSign(), 'base64');
  },

  stringToSign: function stringToSign() {
    var parts = [];
    parts.push(this.request.method);
    parts.push(this.request.endpoint.host.toLowerCase());
    parts.push(this.request.pathname());
    parts.push(AWS.util.queryParamsToString(this.request.params));
    return parts.join('\n');
  }

});

module.exports = AWS.Signers.V2;

},{"../core":11}],49:[function(require,module,exports){
var AWS = require('../core');
var inherit = AWS.util.inherit;


AWS.Signers.V3 = inherit(AWS.Signers.RequestSigner, {
  addAuthorization: function addAuthorization(credentials, date) {

    var datetime = AWS.util.date.rfc822(date);

    this.request.headers['X-Amz-Date'] = datetime;

    if (credentials.sessionToken) {
      this.request.headers['x-amz-security-token'] = credentials.sessionToken;
    }

    this.request.headers['X-Amzn-Authorization'] =
      this.authorization(credentials, datetime);

  },

  authorization: function authorization(credentials) {
    return 'AWS3 ' +
      'AWSAccessKeyId=' + credentials.accessKeyId + ',' +
      'Algorithm=HmacSHA256,' +
      'SignedHeaders=' + this.signedHeaders() + ',' +
      'Signature=' + this.signature(credentials);
  },

  signedHeaders: function signedHeaders() {
    var headers = [];
    AWS.util.arrayEach(this.headersToSign(), function iterator(h) {
      headers.push(h.toLowerCase());
    });
    return headers.sort().join(';');
  },

  canonicalHeaders: function canonicalHeaders() {
    var headers = this.request.headers;
    var parts = [];
    AWS.util.arrayEach(this.headersToSign(), function iterator(h) {
      parts.push(h.toLowerCase().trim() + ':' + String(headers[h]).trim());
    });
    return parts.sort().join('\n') + '\n';
  },

  headersToSign: function headersToSign() {
    var headers = [];
    AWS.util.each(this.request.headers, function iterator(k) {
      if (k === 'Host' || k === 'Content-Encoding' || k.match(/^X-Amz/i)) {
        headers.push(k);
      }
    });
    return headers;
  },

  signature: function signature(credentials) {
    return AWS.util.crypto.hmac(credentials.secretAccessKey, this.stringToSign(), 'base64');
  },

  stringToSign: function stringToSign() {
    var parts = [];
    parts.push(this.request.method);
    parts.push('/');
    parts.push('');
    parts.push(this.canonicalHeaders());
    parts.push(this.request.body);
    return AWS.util.crypto.sha256(parts.join('\n'));
  }

});

module.exports = AWS.Signers.V3;

},{"../core":11}],50:[function(require,module,exports){
var AWS = require('../core');
var inherit = AWS.util.inherit;

require('./v3');


AWS.Signers.V3Https = inherit(AWS.Signers.V3, {
  authorization: function authorization(credentials) {
    return 'AWS3-HTTPS ' +
      'AWSAccessKeyId=' + credentials.accessKeyId + ',' +
      'Algorithm=HmacSHA256,' +
      'Signature=' + this.signature(credentials);
  },

  stringToSign: function stringToSign() {
    return this.request.headers['X-Amz-Date'];
  }
});

module.exports = AWS.Signers.V3Https;

},{"../core":11,"./v3":49}],51:[function(require,module,exports){
var AWS = require('../core');
var inherit = AWS.util.inherit;


var cachedSecret = {};


var cacheQueue = [];


var maxCacheEntries = 50;


var expiresHeader = 'presigned-expires';


AWS.Signers.V4 = inherit(AWS.Signers.RequestSigner, {
  constructor: function V4(request, serviceName, signatureCache) {
    AWS.Signers.RequestSigner.call(this, request);
    this.serviceName = serviceName;
    this.signatureCache = signatureCache;
  },

  algorithm: 'AWS4-HMAC-SHA256',

  addAuthorization: function addAuthorization(credentials, date) {
    var datetime = AWS.util.date.iso8601(date).replace(/[:\-]|\.\d{3}/g, '');

    if (this.isPresigned()) {
      this.updateForPresigned(credentials, datetime);
    } else {
      this.addHeaders(credentials, datetime);
    }

    this.request.headers['Authorization'] =
      this.authorization(credentials, datetime);
  },

  addHeaders: function addHeaders(credentials, datetime) {
    this.request.headers['X-Amz-Date'] = datetime;
    if (credentials.sessionToken) {
      this.request.headers['x-amz-security-token'] = credentials.sessionToken;
    }
  },

  updateForPresigned: function updateForPresigned(credentials, datetime) {
    var credString = this.credentialString(datetime);
    var qs = {
      'X-Amz-Date': datetime,
      'X-Amz-Algorithm': this.algorithm,
      'X-Amz-Credential': credentials.accessKeyId + '/' + credString,
      'X-Amz-Expires': this.request.headers[expiresHeader],
      'X-Amz-SignedHeaders': this.signedHeaders()
    };

    if (credentials.sessionToken) {
      qs['X-Amz-Security-Token'] = credentials.sessionToken;
    }

    if (this.request.headers['Content-Type']) {
      qs['Content-Type'] = this.request.headers['Content-Type'];
    }
    if (this.request.headers['Content-MD5']) {
      qs['Content-MD5'] = this.request.headers['Content-MD5'];
    }
    if (this.request.headers['Cache-Control']) {
      qs['Cache-Control'] = this.request.headers['Cache-Control'];
    }

    AWS.util.each.call(this, this.request.headers, function(key, value) {
      if (key === expiresHeader) return;
      if (this.isSignableHeader(key)) {
        var lowerKey = key.toLowerCase();
        if (lowerKey.indexOf('x-amz-meta-') === 0) {
          qs[lowerKey] = value;
        } else if (lowerKey.indexOf('x-amz-') === 0) {
          qs[key] = value;
        }
      }
    });

    var sep = this.request.path.indexOf('?') >= 0 ? '&' : '?';
    this.request.path += sep + AWS.util.queryParamsToString(qs);
  },

  authorization: function authorization(credentials, datetime) {
    var parts = [];
    var credString = this.credentialString(datetime);
    parts.push(this.algorithm + ' Credential=' +
      credentials.accessKeyId + '/' + credString);
    parts.push('SignedHeaders=' + this.signedHeaders());
    parts.push('Signature=' + this.signature(credentials, datetime));
    return parts.join(', ');
  },

  signature: function signature(credentials, datetime) {
    var cache = null;
    var cacheIdentifier = this.serviceName + (this.getServiceClientId() ? '_' + this.getServiceClientId() : '');
    if (this.signatureCache) {
      var cache = cachedSecret[cacheIdentifier];
      if (!cache) {
        cacheQueue.push(cacheIdentifier);
        if (cacheQueue.length > maxCacheEntries) {
          delete cachedSecret[cacheQueue.shift()];
        }
      }

    }
    var date = datetime.substr(0, 8);

    if (!cache ||
        cache.akid !== credentials.accessKeyId ||
        cache.region !== this.request.region ||
        cache.date !== date) {

      var kSecret = credentials.secretAccessKey;
      var kDate = AWS.util.crypto.hmac('AWS4' + kSecret, date, 'buffer');
      var kRegion = AWS.util.crypto.hmac(kDate, this.request.region, 'buffer');
      var kService = AWS.util.crypto.hmac(kRegion, this.serviceName, 'buffer');
      var kCredentials = AWS.util.crypto.hmac(kService, 'aws4_request', 'buffer');

      if (!this.signatureCache) {
        return AWS.util.crypto.hmac(kCredentials, this.stringToSign(datetime), 'hex');
      }

      cachedSecret[cacheIdentifier] = {
        region: this.request.region, date: date,
        key: kCredentials, akid: credentials.accessKeyId
      };
    }

    var key = cachedSecret[cacheIdentifier].key;
    return AWS.util.crypto.hmac(key, this.stringToSign(datetime), 'hex');
  },

  stringToSign: function stringToSign(datetime) {
    var parts = [];
    parts.push('AWS4-HMAC-SHA256');
    parts.push(datetime);
    parts.push(this.credentialString(datetime));
    parts.push(this.hexEncodedHash(this.canonicalString()));
    return parts.join('\n');
  },

  canonicalString: function canonicalString() {
    var parts = [], pathname = this.request.pathname();
    if (this.serviceName !== 's3') pathname = AWS.util.uriEscapePath(pathname);

    parts.push(this.request.method);
    parts.push(pathname);
    parts.push(this.request.search());
    parts.push(this.canonicalHeaders() + '\n');
    parts.push(this.signedHeaders());
    parts.push(this.hexEncodedBodyHash());
    return parts.join('\n');
  },

  canonicalHeaders: function canonicalHeaders() {
    var headers = [];
    AWS.util.each.call(this, this.request.headers, function (key, item) {
      headers.push([key, item]);
    });
    headers.sort(function (a, b) {
      return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
    });
    var parts = [];
    AWS.util.arrayEach.call(this, headers, function (item) {
      var key = item[0].toLowerCase();
      if (this.isSignableHeader(key)) {
        parts.push(key + ':' +
          this.canonicalHeaderValues(item[1].toString()));
      }
    });
    return parts.join('\n');
  },

  canonicalHeaderValues: function canonicalHeaderValues(values) {
    return values.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
  },

  signedHeaders: function signedHeaders() {
    var keys = [];
    AWS.util.each.call(this, this.request.headers, function (key) {
      key = key.toLowerCase();
      if (this.isSignableHeader(key)) keys.push(key);
    });
    return keys.sort().join(';');
  },

  credentialString: function credentialString(datetime) {
    var parts = [];
    parts.push(datetime.substr(0, 8));
    parts.push(this.request.region);
    parts.push(this.serviceName);
    parts.push('aws4_request');
    return parts.join('/');
  },

  hexEncodedHash: function hash(string) {
    return AWS.util.crypto.sha256(string, 'hex');
  },

  hexEncodedBodyHash: function hexEncodedBodyHash() {
    if (this.isPresigned() && this.serviceName === 's3' && !this.request.body) {
      return 'UNSIGNED-PAYLOAD';
    } else if (this.request.headers['X-Amz-Content-Sha256']) {
      return this.request.headers['X-Amz-Content-Sha256'];
    } else {
      return this.hexEncodedHash(this.request.body || '');
    }
  },

  unsignableHeaders: ['authorization', 'content-type', 'content-length',
                      'user-agent', expiresHeader, 'expect'],

  isSignableHeader: function isSignableHeader(key) {
    if (key.toLowerCase().indexOf('x-amz-') === 0) return true;
    return this.unsignableHeaders.indexOf(key) < 0;
  },

  isPresigned: function isPresigned() {
    return this.request.headers[expiresHeader] ? true : false;
  }

});

module.exports = AWS.Signers.V4;

},{"../core":11}],52:[function(require,module,exports){
function AcceptorStateMachine(states, state) {
  this.currentState = state || null;
  this.states = states || {};
}

AcceptorStateMachine.prototype.runTo = function runTo(finalState, done, bindObject, inputError) {
  if (typeof finalState === 'function') {
    inputError = bindObject; bindObject = done;
    done = finalState; finalState = null;
  }

  var self = this;
  var state = self.states[self.currentState];
  state.fn.call(bindObject || self, inputError, function(err) {
    if (err) {
      if (state.fail) self.currentState = state.fail;
      else return done ? done.call(bindObject, err) : null;
    } else {
      if (state.accept) self.currentState = state.accept;
      else return done ? done.call(bindObject) : null;
    }
    if (self.currentState === finalState) {
      return done ? done.call(bindObject, err) : null;
    }

    self.runTo(finalState, done, bindObject, err);
  });
};

AcceptorStateMachine.prototype.addState = function addState(name, acceptState, failState, fn) {
  if (typeof acceptState === 'function') {
    fn = acceptState; acceptState = null; failState = null;
  } else if (typeof failState === 'function') {
    fn = failState; failState = null;
  }

  if (!this.currentState) this.currentState = name;
  this.states[name] = { accept: acceptState, fail: failState, fn: fn };
  return this;
};

module.exports = AcceptorStateMachine;

},{}],53:[function(require,module,exports){
(function (process){

var AWS;


var util = {
  engine: function engine() {
    if (util.isBrowser() && typeof navigator !== 'undefined') {
      return navigator.userAgent;
    } else {
      return process.platform + '/' + process.version;
    }
  },

  userAgent: function userAgent() {
    var name = util.isBrowser() ? 'js' : 'nodejs';
    var agent = 'aws-sdk-' + name + '/' + require('./core').VERSION;
    if (name === 'nodejs') agent += ' ' + util.engine();
    return agent;
  },

  isBrowser: function isBrowser() { return process && process.browser; },
  isNode: function isNode() { return !util.isBrowser(); },
  uriEscape: function uriEscape(string) {
    var output = encodeURIComponent(string);
    output = output.replace(/[^A-Za-z0-9_.~\-%]+/g, escape);

    output = output.replace(/[*]/g, function(ch) {
      return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
    });

    return output;
  },

  uriEscapePath: function uriEscapePath(string) {
    var parts = [];
    util.arrayEach(string.split('/'), function (part) {
      parts.push(util.uriEscape(part));
    });
    return parts.join('/');
  },

  urlParse: function urlParse(url) {
    return util.url.parse(url);
  },

  urlFormat: function urlFormat(url) {
    return util.url.format(url);
  },

  queryStringParse: function queryStringParse(qs) {
    return util.querystring.parse(qs);
  },

  queryParamsToString: function queryParamsToString(params) {
    var items = [];
    var escape = util.uriEscape;
    var sortedKeys = Object.keys(params).sort();

    util.arrayEach(sortedKeys, function(name) {
      var value = params[name];
      var ename = escape(name);
      var result = ename + '=';
      if (Array.isArray(value)) {
        var vals = [];
        util.arrayEach(value, function(item) { vals.push(escape(item)); });
        result = ename + '=' + vals.sort().join('&' + ename + '=');
      } else if (value !== undefined && value !== null) {
        result = ename + '=' + escape(value);
      }
      items.push(result);
    });

    return items.join('&');
  },

  readFileSync: function readFileSync(path) {
    if (util.isBrowser()) return null;
    return require('fs').readFileSync(path, 'utf-8');
  },

  base64: {

    encode: function encode64(string) {
      return new util.Buffer(string).toString('base64');
    },

    decode: function decode64(string) {
      return new util.Buffer(string, 'base64');
    }

  },

  buffer: {
    toStream: function toStream(buffer) {
      if (!util.Buffer.isBuffer(buffer)) buffer = new util.Buffer(buffer);

      var readable = new (util.stream.Readable)();
      var pos = 0;
      readable._read = function(size) {
        if (pos >= buffer.length) return readable.push(null);

        var end = pos + size;
        if (end > buffer.length) end = buffer.length;
        readable.push(buffer.slice(pos, end));
        pos = end;
      };

      return readable;
    },


    concat: function(buffers) {
      var length = 0,
          offset = 0,
          buffer = null, i;

      for (i = 0; i < buffers.length; i++) {
        length += buffers[i].length;
      }

      buffer = new util.Buffer(length);

      for (i = 0; i < buffers.length; i++) {
        buffers[i].copy(buffer, offset);
        offset += buffers[i].length;
      }

      return buffer;
    }
  },

  string: {
    byteLength: function byteLength(string) {
      if (string === null || string === undefined) return 0;
      if (typeof string === 'string') string = new util.Buffer(string);

      if (typeof string.byteLength === 'number') {
        return string.byteLength;
      } else if (typeof string.length === 'number') {
        return string.length;
      } else if (typeof string.size === 'number') {
        return string.size;
      } else if (typeof string.path === 'string') {
        return require('fs').lstatSync(string.path).size;
      } else {
        throw util.error(new Error('Cannot determine length of ' + string),
          { object: string });
      }
    },

    upperFirst: function upperFirst(string) {
      return string[0].toUpperCase() + string.substr(1);
    },

    lowerFirst: function lowerFirst(string) {
      return string[0].toLowerCase() + string.substr(1);
    }
  },

  ini: {
    parse: function string(ini) {
      var currentSection, map = {};
      util.arrayEach(ini.split(/\r?\n/), function(line) {
        line = line.split(/(^|\s)[;#]/)[0]; // remove comments
        var section = line.match(/^\s*\[([^\[\]]+)\]\s*$/);
        if (section) {
          currentSection = section[1];
        } else if (currentSection) {
          var item = line.match(/^\s*(.+?)\s*=\s*(.+?)\s*$/);
          if (item) {
            map[currentSection] = map[currentSection] || {};
            map[currentSection][item[1]] = item[2];
          }
        }
      });

      return map;
    }
  },

  fn: {
    noop: function() {},


    makeAsync: function makeAsync(fn, expectedArgs) {
      if (expectedArgs && expectedArgs <= fn.length) {
        return fn;
      }

      return function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();
        var result = fn.apply(null, args);
        callback(result);
      };
    }
  },


  date: {


    getDate: function getDate() {
      if (!AWS) AWS = require('./core');
      if (AWS.config.systemClockOffset) { // use offset when non-zero
        return new Date(new Date().getTime() + AWS.config.systemClockOffset);
      } else {
        return new Date();
      }
    },


    iso8601: function iso8601(date) {
      if (date === undefined) { date = util.date.getDate(); }
      return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
    },


    rfc822: function rfc822(date) {
      if (date === undefined) { date = util.date.getDate(); }
      return date.toUTCString();
    },


    unixTimestamp: function unixTimestamp(date) {
      if (date === undefined) { date = util.date.getDate(); }
      return date.getTime() / 1000;
    },


    from: function format(date) {
      if (typeof date === 'number') {
        return new Date(date * 1000); // unix timestamp
      } else {
        return new Date(date);
      }
    },


    format: function format(date, formatter) {
      if (!formatter) formatter = 'iso8601';
      return util.date[formatter](util.date.from(date));
    },

    parseTimestamp: function parseTimestamp(value) {
      if (typeof value === 'number') { // unix timestamp (number)
        return new Date(value * 1000);
      } else if (value.match(/^\d+$/)) { // unix timestamp
        return new Date(value * 1000);
      } else if (value.match(/^\d{4}/)) { // iso8601
        return new Date(value);
      } else if (value.match(/^\w{3},/)) { // rfc822
        return new Date(value);
      } else {
        throw util.error(
          new Error('unhandled timestamp format: ' + value),
          {code: 'TimestampParserError'});
      }
    }

  },

  crypto: {
    crc32Table: [
     0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419,
     0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4,
     0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07,
     0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE,
     0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856,
     0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9,
     0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4,
     0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B,
     0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3,
     0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A,
     0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599,
     0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924,
     0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190,
     0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F,
     0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E,
     0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01,
     0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED,
     0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950,
     0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3,
     0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2,
     0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A,
     0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5,
     0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010,
     0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
     0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17,
     0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6,
     0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615,
     0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8,
     0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344,
     0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB,
     0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A,
     0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5,
     0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1,
     0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C,
     0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF,
     0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236,
     0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE,
     0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31,
     0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C,
     0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713,
     0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B,
     0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242,
     0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1,
     0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C,
     0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278,
     0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7,
     0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66,
     0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
     0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605,
     0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8,
     0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B,
     0x2D02EF8D],

    crc32: function crc32(data) {
      var tbl = util.crypto.crc32Table;
      var crc = 0 ^ -1;

      if (typeof data === 'string') {
        data = new util.Buffer(data);
      }

      for (var i = 0; i < data.length; i++) {
        var code = data.readUInt8(i);
        crc = (crc >>> 8) ^ tbl[(crc ^ code) & 0xFF];
      }
      return (crc ^ -1) >>> 0;
    },

    hmac: function hmac(key, string, digest, fn) {
      if (!digest) digest = 'binary';
      if (digest === 'buffer') { digest = undefined; }
      if (!fn) fn = 'sha256';
      if (typeof string === 'string') string = new util.Buffer(string);
      return util.crypto.lib.createHmac(fn, key).update(string).digest(digest);
    },

    md5: function md5(data, digest, callback) {
      return util.crypto.hash('md5', data, digest, callback);
    },

    sha256: function sha256(data, digest, callback) {
      return util.crypto.hash('sha256', data, digest, callback);
    },

    hash: function(algorithm, data, digest, callback) {
      var hash = util.crypto.createHash(algorithm);
      if (!digest) { digest = 'binary'; }
      if (digest === 'buffer') { digest = undefined; }
      if (typeof data === 'string') data = new util.Buffer(data);
      var sliceFn = util.arraySliceFn(data);
      var isBuffer = util.Buffer.isBuffer(data);
      if (util.isBrowser() && typeof ArrayBuffer !== 'undefined' && data && data.buffer instanceof ArrayBuffer) isBuffer = true;

      if (callback && typeof data === 'object' &&
          typeof data.on === 'function' && !isBuffer) {
        data.on('data', function(chunk) { hash.update(chunk); });
        data.on('error', function(err) { callback(err); });
        data.on('end', function() { callback(null, hash.digest(digest)); });
      } else if (callback && sliceFn && !isBuffer &&
                 typeof FileReader !== 'undefined') {
        var index = 0, size = 1024 * 512;
        var reader = new FileReader();
        reader.onerror = function() {
          callback(new Error('Failed to read data.'));
        };
        reader.onload = function() {
          var buf = new util.Buffer(new Uint8Array(reader.result));
          hash.update(buf);
          index += buf.length;
          reader._continueReading();
        };
        reader._continueReading = function() {
          if (index >= data.size) {
            callback(null, hash.digest(digest));
            return;
          }

          var back = index + size;
          if (back > data.size) back = data.size;
          reader.readAsArrayBuffer(sliceFn.call(data, index, back));
        };

        reader._continueReading();
      } else {
        if (util.isBrowser() && typeof data === 'object' && !isBuffer) {
          data = new util.Buffer(new Uint8Array(data));
        }
        var out = hash.update(data).digest(digest);
        if (callback) callback(null, out);
        return out;
      }
    },

    toHex: function toHex(data) {
      var out = [];
      for (var i = 0; i < data.length; i++) {
        out.push(('0' + data.charCodeAt(i).toString(16)).substr(-2, 2));
      }
      return out.join('');
    },

    createHash: function createHash(algorithm) {
      return util.crypto.lib.createHash(algorithm);
    }

  },




  abort: {},

  each: function each(object, iterFunction) {
    for (var key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        var ret = iterFunction.call(this, key, object[key]);
        if (ret === util.abort) break;
      }
    }
  },

  arrayEach: function arrayEach(array, iterFunction) {
    for (var idx in array) {
      if (Object.prototype.hasOwnProperty.call(array, idx)) {
        var ret = iterFunction.call(this, array[idx], parseInt(idx, 10));
        if (ret === util.abort) break;
      }
    }
  },

  update: function update(obj1, obj2) {
    util.each(obj2, function iterator(key, item) {
      obj1[key] = item;
    });
    return obj1;
  },

  merge: function merge(obj1, obj2) {
    return util.update(util.copy(obj1), obj2);
  },

  copy: function copy(object) {
    if (object === null || object === undefined) return object;
    var dupe = {};
    for (var key in object) {
      dupe[key] = object[key];
    }
    return dupe;
  },

  isEmpty: function isEmpty(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  },

  arraySliceFn: function arraySliceFn(obj) {
    var fn = obj.slice || obj.webkitSlice || obj.mozSlice;
    return typeof fn === 'function' ? fn : null;
  },

  isType: function isType(obj, type) {
    if (typeof type === 'function') type = util.typeName(type);
    return Object.prototype.toString.call(obj) === '[object ' + type + ']';
  },

  typeName: function typeName(type) {
    if (Object.prototype.hasOwnProperty.call(type, 'name')) return type.name;
    var str = type.toString();
    var match = str.match(/^\s*function (.+)\(/);
    return match ? match[1] : str;
  },

  error: function error(err, options) {
    var originalError = null;
    if (typeof err.message === 'string' && err.message !== '') {
      if (typeof options === 'string' || (options && options.message)) {
        originalError = util.copy(err);
        originalError.message = err.message;
      }
    }
    err.message = err.message || null;

    if (typeof options === 'string') {
      err.message = options;
    } else if (typeof options === 'object' && options !== null) {
      util.update(err, options);
      if (options.message)
        err.message = options.message;
      if (options.code || options.name)
        err.code = options.code || options.name;
      if (options.stack)
        err.stack = options.stack;
    }

    if (typeof Object.defineProperty === 'function') {
      Object.defineProperty(err, 'name', {writable: true, enumerable: false});
      Object.defineProperty(err, 'message', {enumerable: true});
    }

    err.name = options && options.name || err.name || err.code || 'Error';
    err.time = new Date();

    if (originalError) err.originalError = originalError;

    return err;
  },


  inherit: function inherit(klass, features) {
    var newObject = null;
    if (features === undefined) {
      features = klass;
      klass = Object;
      newObject = {};
    } else {
      var ctor = function ConstructorWrapper() {};
      ctor.prototype = klass.prototype;
      newObject = new ctor();
    }

    if (features.constructor === Object) {
      features.constructor = function() {
        if (klass !== Object) {
          return klass.apply(this, arguments);
        }
      };
    }

    features.constructor.prototype = newObject;
    util.update(features.constructor.prototype, features);
    features.constructor.__super__ = klass;
    return features.constructor;
  },


  mixin: function mixin() {
    var klass = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      for (var prop in arguments[i].prototype) {
        var fn = arguments[i].prototype[prop];
        if (prop !== 'constructor') {
          klass.prototype[prop] = fn;
        }
      }
    }
    return klass;
  },


  hideProperties: function hideProperties(obj, props) {
    if (typeof Object.defineProperty !== 'function') return;

    util.arrayEach(props, function (key) {
      Object.defineProperty(obj, key, {
        enumerable: false, writable: true, configurable: true });
    });
  },


  property: function property(obj, name, value, enumerable, isValue) {
    var opts = {
      configurable: true,
      enumerable: enumerable !== undefined ? enumerable : true
    };
    if (typeof value === 'function' && !isValue) {
      opts.get = value;
    }
    else {
      opts.value = value; opts.writable = true;
    }

    Object.defineProperty(obj, name, opts);
  },


  memoizedProperty: function memoizedProperty(obj, name, get, enumerable) {
    var cachedValue = null;

    util.property(obj, name, function() {
      if (cachedValue === null) {
        cachedValue = get();
      }
      return cachedValue;
    }, enumerable);
  },


  hoistPayloadMember: function hoistPayloadMember(resp) {
    var req = resp.request;
    var operation = req.operation;
    var output = req.service.api.operations[operation].output;
    if (output.payload) {
      var payloadMember = output.members[output.payload];
      var responsePayload = resp.data[output.payload];
      if (payloadMember.type === 'structure') {
        util.each(responsePayload, function(key, value) {
          util.property(resp.data, key, value, false);
        });
      }
    }
  },


  computeSha256: function computeSha256(body, done) {
    if (util.isNode()) {
      var Stream = util.stream.Stream;
      var fs = require('fs');
      if (body instanceof Stream) {
        if (typeof body.path === 'string') { // assume file object
          var settings = {};
          if (typeof body.start === 'number') {
            settings.start = body.start;
          }
          if (typeof body.end === 'number') {
            settings.end = body.end;
          }
          body = fs.createReadStream(body.path, settings);
        } else { // TODO support other stream types
          return done(new Error('Non-file stream objects are ' +
                                'not supported with SigV4'));
        }
      }
    }

    util.crypto.sha256(body, 'hex', function(err, sha) {
      if (err) done(err);
      else done(null, sha);
    });
  },


  isClockSkewed: function isClockSkewed(serverTime) {
    if (serverTime) {
      util.property(AWS.config, 'isClockSkewed',
        Math.abs(new Date().getTime() - serverTime) >= 300000, false);
      return AWS.config.isClockSkewed;
    }
  },

  applyClockOffset: function applyClockOffset(serverTime) {
    if (serverTime)
      AWS.config.systemClockOffset = serverTime - new Date().getTime();
  },


  extractRequestId: function extractRequestId(resp) {
    var requestId = resp.httpResponse.headers['x-amz-request-id'] ||
                     resp.httpResponse.headers['x-amzn-requestid'];

    if (!requestId && resp.data && resp.data.ResponseMetadata) {
      requestId = resp.data.ResponseMetadata.RequestId;
    }

    if (requestId) {
      resp.requestId = requestId;
    }

    if (resp.error) {
      resp.error.requestId = requestId;
    }
  },


  addPromisesToRequests: function addPromisesToRequests(constructor, PromiseDependency) {
    PromiseDependency = PromiseDependency || null;
    if (!PromiseDependency && typeof Promise !== 'undefined') {
      PromiseDependency = Promise;
    }
    if (typeof PromiseDependency !== 'function') {
      delete constructor.prototype.promise;
      return;
    }
    constructor.prototype.promise = function promise() {
      var self = this;
      return new PromiseDependency(function(resolve, reject) {
        self.on('complete', function(resp) {
          if (resp.error) {
            reject(resp.error);
          } else {
            resolve(resp.data);
          }
        });
        self.runTo();
      });
    }
  },


  isDualstackAvailable: function isDualstackAvailable(service) {
    if (!service) return false;
    var metadata = require('../apis/metadata.json');
    if (typeof service !== 'string') service = service.serviceIdentifier;
    if (typeof service !== 'string' || !metadata.hasOwnProperty(service)) return false;
    return !!metadata[service].dualstackAvailable;
  },


  calculateRetryDelay: function calculateRetryDelay(retryCount, retryDelayOptions) {
    if (!retryDelayOptions) retryDelayOptions = {};
    var customBackoff = retryDelayOptions.customBackoff || null;
    if (typeof customBackoff === 'function') {
      return customBackoff(retryCount);
    }
    var base = retryDelayOptions.base || 100;
    var delay = Math.random() * (Math.pow(2, retryCount) * base);
    return delay;
  },


  handleRequestWithRetries: function handleRequestWithRetries(httpRequest, options, cb) {
    if (!options) options = {};
    var http = AWS.HttpClient.getInstance();
    var httpOptions = options.httpOptions || {};
    var retryCount = 0;

    var errCallback = function(err) {
      var maxRetries = options.maxRetries || 0;
      if (err && err.code === 'TimeoutError') err.retryable = true;
      if (err && err.retryable && retryCount < maxRetries) {
        retryCount++;
        var delay = util.calculateRetryDelay(retryCount, options.retryDelayOptions);
        setTimeout(sendRequest, delay + (err.retryAfter || 0));
      } else {
        cb(err);
      }
    };

    var sendRequest = function() {
      var data = '';
      http.handleRequest(httpRequest, httpOptions, function(httpResponse) {
        httpResponse.on('data', function(chunk) { data += chunk.toString(); });
        httpResponse.on('end', function() {
          var statusCode = httpResponse.statusCode;
          if (statusCode < 300) {
            cb(null, data);
          } else {
            var retryAfter = parseInt(httpResponse.headers['retry-after'], 10) * 1000 || 0;
            var err = util.error(new Error(),
              { retryable: statusCode >= 500 || statusCode === 429 }
            );
            if (retryAfter && err.retryable) err.retryAfter = retryAfter;
            errCallback(err);
          }
        });
      }, errCallback);
    };

    process.nextTick(sendRequest);
  }

};

module.exports = util;

}).call(this,require("FWaASH"))
},{"../apis/metadata.json":3,"./core":11,"FWaASH":62,"fs":56}],54:[function(require,module,exports){
var util = require('../util');
var Shape = require('../model/shape');

function DomXmlParser() { }

DomXmlParser.prototype.parse = function(xml, shape) {
  if (xml.replace(/^\s+/, '') === '') return {};

  var result, error;
  try {
    if (window.DOMParser) {
      try {
        var parser = new DOMParser();
        result = parser.parseFromString(xml, 'text/xml');
      } catch (syntaxError) {
        throw util.error(new Error('Parse error in document'),
          {
            originalError: syntaxError,
            code: 'XMLParserError',
            retryable: true
          });
      }

      if (result.documentElement === null) {
        throw util.error(new Error('Cannot parse empty document.'),
          {
            code: 'XMLParserError',
            retryable: true
          });
      }

      var isError = result.getElementsByTagName('parsererror')[0];
      if (isError && (isError.parentNode === result ||
          isError.parentNode.nodeName === 'body' ||
          isError.parentNode.parentNode === result ||
          isError.parentNode.parentNode.nodeName === 'body')) {
        var errorElement = isError.getElementsByTagName('div')[0] || isError;
        throw util.error(new Error(errorElement.textContent || 'Parser error in document'),
          {
            code: 'XMLParserError',
            retryable: true
          });
      }
    } else if (window.ActiveXObject) {
      result = new window.ActiveXObject('Microsoft.XMLDOM');
      result.async = false;

      if (!result.loadXML(xml)) {
        throw util.error(new Error('Parse error in document'),
          {
            code: 'XMLParserError',
            retryable: true
          });
      }
    } else {
      throw new Error('Cannot load XML parser');
    }
  } catch (e) {
    error = e;
  }

  if (result && result.documentElement && !error) {
    var data = parseXml(result.documentElement, shape);
    var metadata = result.getElementsByTagName('ResponseMetadata')[0];
    if (metadata) {
      data.ResponseMetadata = parseXml(metadata, {});
    }
    return data;
  } else if (error) {
    throw util.error(error || new Error(), {code: 'XMLParserError', retryable: true});
  } else { // empty xml document
    return {};
  }
};

function parseXml(xml, shape) {
  if (!shape) shape = {};
  switch (shape.type) {
    case 'structure': return parseStructure(xml, shape);
    case 'map': return parseMap(xml, shape);
    case 'list': return parseList(xml, shape);
    case undefined: case null: return parseUnknown(xml);
    default: return parseScalar(xml, shape);
  }
}

function parseStructure(xml, shape) {
  var data = {};
  if (xml === null) return data;

  util.each(shape.members, function(memberName, memberShape) {
    if (memberShape.isXmlAttribute) {
      if (Object.prototype.hasOwnProperty.call(xml.attributes, memberShape.name)) {
        var value = xml.attributes[memberShape.name].value;
        data[memberName] = parseXml({textContent: value}, memberShape);
      }
    } else {
      var xmlChild = memberShape.flattened ? xml :
        xml.getElementsByTagName(memberShape.name)[0];
      if (xmlChild) {
        data[memberName] = parseXml(xmlChild, memberShape);
      } else if (!memberShape.flattened && memberShape.type === 'list') {
        data[memberName] = memberShape.defaultValue;
      }
    }
  });

  return data;
}

function parseMap(xml, shape) {
  var data = {};
  var xmlKey = shape.key.name || 'key';
  var xmlValue = shape.value.name || 'value';
  var tagName = shape.flattened ? shape.name : 'entry';

  var child = xml.firstElementChild;
  while (child) {
    if (child.nodeName === tagName) {
      var key = child.getElementsByTagName(xmlKey)[0].textContent;
      var value = child.getElementsByTagName(xmlValue)[0];
      data[key] = parseXml(value, shape.value);
    }
    child = child.nextElementSibling;
  }
  return data;
}

function parseList(xml, shape) {
  var data = [];
  var tagName = shape.flattened ? shape.name : (shape.member.name || 'member');

  var child = xml.firstElementChild;
  while (child) {
    if (child.nodeName === tagName) {
      data.push(parseXml(child, shape.member));
    }
    child = child.nextElementSibling;
  }
  return data;
}

function parseScalar(xml, shape) {
  if (xml.getAttribute) {
    var encoding = xml.getAttribute('encoding');
    if (encoding === 'base64') {
      shape = new Shape.create({type: encoding});
    }
  }

  var text = xml.textContent;
  if (text === '') text = null;
  if (typeof shape.toType === 'function') {
    return shape.toType(text);
  } else {
    return text;
  }
}

function parseUnknown(xml) {
  if (xml === undefined || xml === null) return '';

  if (!xml.firstElementChild) {
    if (xml.parentNode.parentNode === null) return {};
    if (xml.childNodes.length === 0) return '';
    else return xml.textContent;
  }

  var shape = {type: 'structure', members: {}};
  var child = xml.firstElementChild;
  while (child) {
    var tag = child.nodeName;
    if (Object.prototype.hasOwnProperty.call(shape.members, tag)) {
      shape.members[tag].type = 'list';
    } else {
      shape.members[tag] = {name: tag};
    }
    child = child.nextElementSibling;
  }
  return parseStructure(xml, shape);
}

module.exports = DomXmlParser;

},{"../model/shape":28,"../util":53}],55:[function(require,module,exports){
var util = require('../util');
var builder = require('xmlbuilder');

function XmlBuilder() { }

XmlBuilder.prototype.toXML = function(params, shape, rootElement, noEmpty) {
  var xml = builder.create(rootElement);
  applyNamespaces(xml, shape);
  serialize(xml, params, shape);
  return xml.children.length > 0 || noEmpty ? xml.root().toString() : '';
};

function serialize(xml, value, shape) {
  switch (shape.type) {
    case 'structure': return serializeStructure(xml, value, shape);
    case 'map': return serializeMap(xml, value, shape);
    case 'list': return serializeList(xml, value, shape);
    default: return serializeScalar(xml, value, shape);
  }
}

function serializeStructure(xml, params, shape) {
  util.arrayEach(shape.memberNames, function(memberName) {
    var memberShape = shape.members[memberName];
    if (memberShape.location !== 'body') return;

    var value = params[memberName];
    var name = memberShape.name;
    if (value !== undefined && value !== null) {
      if (memberShape.isXmlAttribute) {
        xml.att(name, value);
      } else if (memberShape.flattened) {
        serialize(xml, value, memberShape);
      } else {
        var element = xml.ele(name);
        applyNamespaces(element, memberShape);
        serialize(element, value, memberShape);
      }
    }
  });
}

function serializeMap(xml, map, shape) {
  var xmlKey = shape.key.name || 'key';
  var xmlValue = shape.value.name || 'value';

  util.each(map, function(key, value) {
    var entry = xml.ele(shape.flattened ? shape.name : 'entry');
    serialize(entry.ele(xmlKey), key, shape.key);
    serialize(entry.ele(xmlValue), value, shape.value);
  });
}

function serializeList(xml, list, shape) {
  if (shape.flattened) {
    util.arrayEach(list, function(value) {
      var name = shape.member.name || shape.name;
      var element = xml.ele(name);
      serialize(element, value, shape.member);
    });
  } else {
    util.arrayEach(list, function(value) {
      var name = shape.member.name || 'member';
      var element = xml.ele(name);
      serialize(element, value, shape.member);
    });
  }
}

function serializeScalar(xml, value, shape) {
  xml.txt(shape.toWireFormat(value));
}

function applyNamespaces(xml, shape) {
  var uri, prefix = 'xmlns';
  if (shape.xmlNamespaceUri) {
    uri = shape.xmlNamespaceUri;
    if (shape.xmlNamespacePrefix) prefix += ':' + shape.xmlNamespacePrefix;
  } else if (xml.isRoot && shape.api.xmlNamespaceUri) {
    uri = shape.api.xmlNamespaceUri;
  }

  if (uri) xml.att(prefix, uri);
}

module.exports = XmlBuilder;

},{"../util":53,"xmlbuilder":100}],56:[function(require,module,exports){

},{}],57:[function(require,module,exports){


var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192


Buffer._useTypedArrays = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()


function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    buf._set(subject)
  } else if (isArrayish(subject)) {
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}


Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}


function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}


Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}


function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype


Buffer._augment = function (arr) {
  arr._isBuffer = true

  arr._get = arr.get
  arr._set = arr.set

  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}


function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":58,"ieee754":59}],58:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],59:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],60:[function(require,module,exports){

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

EventEmitter.defaultMaxListeners = 10;

EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    this._events[type].push(listener);
  else
    this._events[type] = [this._events[type], listener];

  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],61:[function(require,module,exports){
if (typeof Object.create === 'function') {
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],62:[function(require,module,exports){

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],63:[function(require,module,exports){
(function (global){

;(function(root) {


	var freeExports = typeof exports == 'object' && exports;
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}


	var punycode,


	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1


	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'


	regexPunycode = /^xn--/,
	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators


	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},


	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,


	key;




	function error(type) {
		throw RangeError(errors[type]);
	}


	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}


	function mapDomain(string, fn) {
		return map(string.split(regexSeparators), fn).join('.');
	}


	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}


	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}


	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}


	function digitToBasic(digit, flag) {
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}


	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}


	function decode(input) {
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,

		    baseMinusT;


		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}


		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}


	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],

		    inputLength,

		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		input = ucs2decode(input);

		inputLength = input.length;

		n = initialN;
		delta = 0;
		bias = initialBias;

		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;


		if (basicLength) {
			output.push(delimiter);
		}

		while (handledCPCount < inputLength) {

			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}


	function toUnicode(domain) {
		return mapDomain(domain, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}


	function toASCII(domain) {
		return mapDomain(domain, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}




	punycode = {

		'version': '1.2.4',

		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};


	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],64:[function(require,module,exports){

'use strict';

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],65:[function(require,module,exports){

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],66:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":64,"./encode":65}],67:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],68:[function(require,module,exports){
(function (process,global){

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


exports.deprecate = function(fn, msg) {
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};




function inspect(obj, opts) {
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    ctx.showHidden = opts;
  } else if (opts) {
    exports._extend(ctx, opts);
  }
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      value.inspect !== exports.inspect &&
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};



exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":67,"FWaASH":62,"inherits":61}],69:[function(require,module,exports){
(function (global){



'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50


Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()


exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}



function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}


Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}


Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}


Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}

Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false


  if (start === undefined || start < 0) {
    start = 0
  }
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  if (buffer.length === 0) return -1

  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}


function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

Buffer.prototype.fill = function fill (val, start, end, encoding) {
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}


var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  if (str.length < 2) return ''
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      if (!leadSurrogate) {
        if (codePoint > 0xDBFF) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        leadSurrogate = codePoint

        continue
      }

      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":70,"ieee754":71,"isarray":72}],70:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  arr = new Arr(len * 3 / 4 - placeHolders)

  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],71:[function(require,module,exports){
module.exports=require(59)
},{}],72:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],73:[function(require,module,exports){
var Buffer = require('buffer').Buffer;
var intSize = 4;
var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
var chrsz = 8;

function toArray(buf, bigEndian) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize));
    buf = Buffer.concat([buf, zeroBuffer], len);
  }

  var arr = [];
  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
  for (var i = 0; i < buf.length; i += intSize) {
    arr.push(fn.call(buf, i));
  }
  return arr;
}

function toBuffer(arr, size, bigEndian) {
  var buf = new Buffer(size);
  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
  for (var i = 0; i < arr.length; i++) {
    fn.call(buf, arr[i], i * 4, true);
  }
  return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
  return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash: hash };

},{"buffer":57}],74:[function(require,module,exports){
var Buffer = require('buffer').Buffer
var sha = require('./sha')
var sha256 = require('./sha256')
var rng = require('./rng')
var md5 = require('./md5')

var algorithms = {
  sha1: sha,
  sha256: sha256,
  md5: md5
}

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)
function hmac(fn, key, data) {
  if(!Buffer.isBuffer(key)) key = new Buffer(key)
  if(!Buffer.isBuffer(data)) data = new Buffer(data)

  if(key.length > blocksize) {
    key = fn(key)
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = new Buffer(blocksize), opad = new Buffer(blocksize)
  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var hash = fn(Buffer.concat([ipad, data]))
  return fn(Buffer.concat([opad, hash]))
}

function hash(alg, key) {
  alg = alg || 'sha1'
  var fn = algorithms[alg]
  var bufs = []
  var length = 0
  if(!fn) error('algorithm:', alg, 'is not yet supported')
  return {
    update: function (data) {
      if(!Buffer.isBuffer(data)) data = new Buffer(data)
        
      bufs.push(data)
      length += data.length
      return this
    },
    digest: function (enc) {
      var buf = Buffer.concat(bufs)
      var r = key ? hmac(fn, key, buf) : fn(buf)
      bufs = null
      return enc ? r.toString(enc) : r
    }
  }
}

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = function (alg) { return hash(alg) }
exports.createHmac = function (alg, key) { return hash(alg, key) }
exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDiffieHellman'
, 'pbkdf2'], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})

},{"./md5":75,"./rng":76,"./sha":77,"./sha256":78,"buffer":57}],75:[function(require,module,exports){


var helpers = require('./helpers');


function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}


function core_md5(x, len)
{

  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}


function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}


function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}


function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md5(buf) {
  return helpers.hash(buf, core_md5, 16);
};

},{"./helpers":73}],76:[function(require,module,exports){
(function() {
  var _global = this;

  var mathRNG, whatwgRNG;

  mathRNG = function(size) {
    var bytes = new Array(size);
    var r;

    for (var i = 0, r; i < size; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return bytes;
  }

  if (_global.crypto && crypto.getRandomValues) {
    whatwgRNG = function(size) {
      var bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);
      return bytes;
    }
  }

  module.exports = whatwgRNG || mathRNG;

}())

},{}],77:[function(require,module,exports){


var helpers = require('./helpers');


function core_sha1(x, len)
{

  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}


function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}


function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}


function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}


function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function sha1(buf) {
  return helpers.hash(buf, core_sha1, 20, true);
};

},{"./helpers":73}],78:[function(require,module,exports){



var helpers = require('./helpers');

var safe_add = function(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
};

var S = function(X, n) {
  return (X >>> n) | (X << (32 - n));
};

var R = function(X, n) {
  return (X >>> n);
};

var Ch = function(x, y, z) {
  return ((x & y) ^ ((~x) & z));
};

var Maj = function(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z));
};

var Sigma0256 = function(x) {
  return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
};

var Sigma1256 = function(x) {
  return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
};

var Gamma0256 = function(x) {
  return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
};

var Gamma1256 = function(x) {
  return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
};

var core_sha256 = function(m, l) {
  var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
  var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;
  for (var i = 0; i < m.length; i += 16) {
    a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
    for (var j = 0; j < 64; j++) {
      if (j < 16) {
        W[j] = m[j + i];
      } else {
        W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
      }
      T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
      T2 = safe_add(Sigma0256(a), Maj(a, b, c));
      h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
  }
  return HASH;
};

module.exports = function sha256(buf) {
  return helpers.hash(buf, core_sha256, 32, true);
};

},{"./helpers":73}],79:[function(require,module,exports){
(function(exports) {
  "use strict";

  function isArray(obj) {
    if (obj !== null) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    } else {
      return false;
    }
  }

  function isObject(obj) {
    if (obj !== null) {
      return Object.prototype.toString.call(obj) === "[object Object]";
    } else {
      return false;
    }
  }

  function strictDeepEqual(first, second) {
    if (first === second) {
      return true;
    }

    var firstType = Object.prototype.toString.call(first);
    if (firstType !== Object.prototype.toString.call(second)) {
      return false;
    }
    if (isArray(first) === true) {
      if (first.length !== second.length) {
        return false;
      }
      for (var i = 0; i < first.length; i++) {
        if (strictDeepEqual(first[i], second[i]) === false) {
          return false;
        }
      }
      return true;
    }
    if (isObject(first) === true) {
      var keysSeen = {};
      for (var key in first) {
        if (hasOwnProperty.call(first, key)) {
          if (strictDeepEqual(first[key], second[key]) === false) {
            return false;
          }
          keysSeen[key] = true;
        }
      }
      for (var key2 in second) {
        if (hasOwnProperty.call(second, key2)) {
          if (keysSeen[key2] !== true) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  function isFalse(obj) {

    if (obj === "" || obj === false || obj === null) {
        return true;
    } else if (isArray(obj) && obj.length === 0) {
        return true;
    } else if (isObject(obj)) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              return false;
            }
        }
        return true;
    } else {
        return false;
    }
  }

  function objValues(obj) {
    var keys = Object.keys(obj);
    var values = [];
    for (var i = 0; i < keys.length; i++) {
      values.push(obj[keys[i]]);
    }
    return values;
  }

  function merge(a, b) {
      var merged = {};
      for (var key in a) {
          merged[key] = a[key];
      }
      for (var key2 in b) {
          merged[key2] = b[key2];
      }
      return merged;
  }

  var trimLeft;
  if (typeof String.prototype.trimLeft === "function") {
    trimLeft = function(str) {
      return str.trimLeft();
    };
  } else {
    trimLeft = function(str) {
      return str.match(/^\s*(.*)/)[1];
    };
  }

  var TYPE_NUMBER = 0;
  var TYPE_ANY = 1;
  var TYPE_STRING = 2;
  var TYPE_ARRAY = 3;
  var TYPE_OBJECT = 4;
  var TYPE_BOOLEAN = 5;
  var TYPE_EXPREF = 6;
  var TYPE_NULL = 7;
  var TYPE_ARRAY_NUMBER = 8;
  var TYPE_ARRAY_STRING = 9;

  var TOK_EOF = "EOF";
  var TOK_UNQUOTEDIDENTIFIER = "UnquotedIdentifier";
  var TOK_QUOTEDIDENTIFIER = "QuotedIdentifier";
  var TOK_RBRACKET = "Rbracket";
  var TOK_RPAREN = "Rparen";
  var TOK_COMMA = "Comma";
  var TOK_COLON = "Colon";
  var TOK_RBRACE = "Rbrace";
  var TOK_NUMBER = "Number";
  var TOK_CURRENT = "Current";
  var TOK_EXPREF = "Expref";
  var TOK_PIPE = "Pipe";
  var TOK_OR = "Or";
  var TOK_AND = "And";
  var TOK_EQ = "EQ";
  var TOK_GT = "GT";
  var TOK_LT = "LT";
  var TOK_GTE = "GTE";
  var TOK_LTE = "LTE";
  var TOK_NE = "NE";
  var TOK_FLATTEN = "Flatten";
  var TOK_STAR = "Star";
  var TOK_FILTER = "Filter";
  var TOK_DOT = "Dot";
  var TOK_NOT = "Not";
  var TOK_LBRACE = "Lbrace";
  var TOK_LBRACKET = "Lbracket";
  var TOK_LPAREN= "Lparen";
  var TOK_LITERAL= "Literal";


  var basicTokens = {
    ".": TOK_DOT,
    "*": TOK_STAR,
    ",": TOK_COMMA,
    ":": TOK_COLON,
    "{": TOK_LBRACE,
    "}": TOK_RBRACE,
    "]": TOK_RBRACKET,
    "(": TOK_LPAREN,
    ")": TOK_RPAREN,
    "@": TOK_CURRENT
  };

  var operatorStartToken = {
      "<": true,
      ">": true,
      "=": true,
      "!": true
  };

  var skipChars = {
      " ": true,
      "\t": true,
      "\n": true
  };


  function isAlpha(ch) {
      return (ch >= "a" && ch <= "z") ||
             (ch >= "A" && ch <= "Z") ||
             ch === "_";
  }

  function isNum(ch) {
      return (ch >= "0" && ch <= "9") ||
             ch === "-";
  }
  function isAlphaNum(ch) {
      return (ch >= "a" && ch <= "z") ||
             (ch >= "A" && ch <= "Z") ||
             (ch >= "0" && ch <= "9") ||
             ch === "_";
  }

  function Lexer() {
  }
  Lexer.prototype = {
      tokenize: function(stream) {
          var tokens = [];
          this._current = 0;
          var start;
          var identifier;
          var token;
          while (this._current < stream.length) {
              if (isAlpha(stream[this._current])) {
                  start = this._current;
                  identifier = this._consumeUnquotedIdentifier(stream);
                  tokens.push({type: TOK_UNQUOTEDIDENTIFIER,
                               value: identifier,
                               start: start});
              } else if (basicTokens[stream[this._current]] !== undefined) {
                  tokens.push({type: basicTokens[stream[this._current]],
                              value: stream[this._current],
                              start: this._current});
                  this._current++;
              } else if (isNum(stream[this._current])) {
                  token = this._consumeNumber(stream);
                  tokens.push(token);
              } else if (stream[this._current] === "[") {
                  token = this._consumeLBracket(stream);
                  tokens.push(token);
              } else if (stream[this._current] === "\"") {
                  start = this._current;
                  identifier = this._consumeQuotedIdentifier(stream);
                  tokens.push({type: TOK_QUOTEDIDENTIFIER,
                               value: identifier,
                               start: start});
              } else if (stream[this._current] === "'") {
                  start = this._current;
                  identifier = this._consumeRawStringLiteral(stream);
                  tokens.push({type: TOK_LITERAL,
                               value: identifier,
                               start: start});
              } else if (stream[this._current] === "`") {
                  start = this._current;
                  var literal = this._consumeLiteral(stream);
                  tokens.push({type: TOK_LITERAL,
                               value: literal,
                               start: start});
              } else if (operatorStartToken[stream[this._current]] !== undefined) {
                  tokens.push(this._consumeOperator(stream));
              } else if (skipChars[stream[this._current]] !== undefined) {
                  this._current++;
              } else if (stream[this._current] === "&") {
                  start = this._current;
                  this._current++;
                  if (stream[this._current] === "&") {
                      this._current++;
                      tokens.push({type: TOK_AND, value: "&&", start: start});
                  } else {
                      tokens.push({type: TOK_EXPREF, value: "&", start: start});
                  }
              } else if (stream[this._current] === "|") {
                  start = this._current;
                  this._current++;
                  if (stream[this._current] === "|") {
                      this._current++;
                      tokens.push({type: TOK_OR, value: "||", start: start});
                  } else {
                      tokens.push({type: TOK_PIPE, value: "|", start: start});
                  }
              } else {
                  var error = new Error("Unknown character:" + stream[this._current]);
                  error.name = "LexerError";
                  throw error;
              }
          }
          return tokens;
      },

      _consumeUnquotedIdentifier: function(stream) {
          var start = this._current;
          this._current++;
          while (this._current < stream.length && isAlphaNum(stream[this._current])) {
              this._current++;
          }
          return stream.slice(start, this._current);
      },

      _consumeQuotedIdentifier: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (stream[this._current] !== "\"" && this._current < maxLength) {
              var current = this._current;
              if (stream[current] === "\\" && (stream[current + 1] === "\\" ||
                                               stream[current + 1] === "\"")) {
                  current += 2;
              } else {
                  current++;
              }
              this._current = current;
          }
          this._current++;
          return JSON.parse(stream.slice(start, this._current));
      },

      _consumeRawStringLiteral: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (stream[this._current] !== "'" && this._current < maxLength) {
              var current = this._current;
              if (stream[current] === "\\" && (stream[current + 1] === "\\" ||
                                               stream[current + 1] === "'")) {
                  current += 2;
              } else {
                  current++;
              }
              this._current = current;
          }
          this._current++;
          var literal = stream.slice(start + 1, this._current - 1);
          return literal.replace("\\'", "'");
      },

      _consumeNumber: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (isNum(stream[this._current]) && this._current < maxLength) {
              this._current++;
          }
          var value = parseInt(stream.slice(start, this._current));
          return {type: TOK_NUMBER, value: value, start: start};
      },

      _consumeLBracket: function(stream) {
          var start = this._current;
          this._current++;
          if (stream[this._current] === "?") {
              this._current++;
              return {type: TOK_FILTER, value: "[?", start: start};
          } else if (stream[this._current] === "]") {
              this._current++;
              return {type: TOK_FLATTEN, value: "[]", start: start};
          } else {
              return {type: TOK_LBRACKET, value: "[", start: start};
          }
      },

      _consumeOperator: function(stream) {
          var start = this._current;
          var startingChar = stream[start];
          this._current++;
          if (startingChar === "!") {
              if (stream[this._current] === "=") {
                  this._current++;
                  return {type: TOK_NE, value: "!=", start: start};
              } else {
                return {type: TOK_NOT, value: "!", start: start};
              }
          } else if (startingChar === "<") {
              if (stream[this._current] === "=") {
                  this._current++;
                  return {type: TOK_LTE, value: "<=", start: start};
              } else {
                  return {type: TOK_LT, value: "<", start: start};
              }
          } else if (startingChar === ">") {
              if (stream[this._current] === "=") {
                  this._current++;
                  return {type: TOK_GTE, value: ">=", start: start};
              } else {
                  return {type: TOK_GT, value: ">", start: start};
              }
          } else if (startingChar === "=") {
              if (stream[this._current] === "=") {
                  this._current++;
                  return {type: TOK_EQ, value: "==", start: start};
              }
          }
      },

      _consumeLiteral: function(stream) {
          this._current++;
          var start = this._current;
          var maxLength = stream.length;
          var literal;
          while(stream[this._current] !== "`" && this._current < maxLength) {
              var current = this._current;
              if (stream[current] === "\\" && (stream[current + 1] === "\\" ||
                                               stream[current + 1] === "`")) {
                  current += 2;
              } else {
                  current++;
              }
              this._current = current;
          }
          var literalString = trimLeft(stream.slice(start, this._current));
          literalString = literalString.replace("\\`", "`");
          if (this._looksLikeJSON(literalString)) {
              literal = JSON.parse(literalString);
          } else {
              literal = JSON.parse("\"" + literalString + "\"");
          }
          this._current++;
          return literal;
      },

      _looksLikeJSON: function(literalString) {
          var startingChars = "[{\"";
          var jsonLiterals = ["true", "false", "null"];
          var numberLooking = "-0123456789";

          if (literalString === "") {
              return false;
          } else if (startingChars.indexOf(literalString[0]) >= 0) {
              return true;
          } else if (jsonLiterals.indexOf(literalString) >= 0) {
              return true;
          } else if (numberLooking.indexOf(literalString[0]) >= 0) {
              try {
                  JSON.parse(literalString);
                  return true;
              } catch (ex) {
                  return false;
              }
          } else {
              return false;
          }
      }
  };

      var bindingPower = {};
      bindingPower[TOK_EOF] = 0;
      bindingPower[TOK_UNQUOTEDIDENTIFIER] = 0;
      bindingPower[TOK_QUOTEDIDENTIFIER] = 0;
      bindingPower[TOK_RBRACKET] = 0;
      bindingPower[TOK_RPAREN] = 0;
      bindingPower[TOK_COMMA] = 0;
      bindingPower[TOK_RBRACE] = 0;
      bindingPower[TOK_NUMBER] = 0;
      bindingPower[TOK_CURRENT] = 0;
      bindingPower[TOK_EXPREF] = 0;
      bindingPower[TOK_PIPE] = 1;
      bindingPower[TOK_OR] = 2;
      bindingPower[TOK_AND] = 3;
      bindingPower[TOK_EQ] = 5;
      bindingPower[TOK_GT] = 5;
      bindingPower[TOK_LT] = 5;
      bindingPower[TOK_GTE] = 5;
      bindingPower[TOK_LTE] = 5;
      bindingPower[TOK_NE] = 5;
      bindingPower[TOK_FLATTEN] = 9;
      bindingPower[TOK_STAR] = 20;
      bindingPower[TOK_FILTER] = 21;
      bindingPower[TOK_DOT] = 40;
      bindingPower[TOK_NOT] = 45;
      bindingPower[TOK_LBRACE] = 50;
      bindingPower[TOK_LBRACKET] = 55;
      bindingPower[TOK_LPAREN] = 60;

  function Parser() {
  }

  Parser.prototype = {
      parse: function(expression) {
          this._loadTokens(expression);
          this.index = 0;
          var ast = this.expression(0);
          if (this._lookahead(0) !== TOK_EOF) {
              var t = this._lookaheadToken(0);
              var error = new Error(
                  "Unexpected token type: " + t.type + ", value: " + t.value);
              error.name = "ParserError";
              throw error;
          }
          return ast;
      },

      _loadTokens: function(expression) {
          var lexer = new Lexer();
          var tokens = lexer.tokenize(expression);
          tokens.push({type: TOK_EOF, value: "", start: expression.length});
          this.tokens = tokens;
      },

      expression: function(rbp) {
          var leftToken = this._lookaheadToken(0);
          this._advance();
          var left = this.nud(leftToken);
          var currentToken = this._lookahead(0);
          while (rbp < bindingPower[currentToken]) {
              this._advance();
              left = this.led(currentToken, left);
              currentToken = this._lookahead(0);
          }
          return left;
      },

      _lookahead: function(number) {
          return this.tokens[this.index + number].type;
      },

      _lookaheadToken: function(number) {
          return this.tokens[this.index + number];
      },

      _advance: function() {
          this.index++;
      },

      nud: function(token) {
        var left;
        var right;
        var expression;
        switch (token.type) {
          case TOK_LITERAL:
            return {type: "Literal", value: token.value};
          case TOK_UNQUOTEDIDENTIFIER:
            return {type: "Field", name: token.value};
          case TOK_QUOTEDIDENTIFIER:
            var node = {type: "Field", name: token.value};
            if (this._lookahead(0) === TOK_LPAREN) {
                throw new Error("Quoted identifier not allowed for function names.");
            } else {
                return node;
            }
            break;
          case TOK_NOT:
            right = this.expression(bindingPower.Not);
            return {type: "NotExpression", children: [right]};
          case TOK_STAR:
            left = {type: "Identity"};
            right = null;
            if (this._lookahead(0) === TOK_RBRACKET) {
                right = {type: "Identity"};
            } else {
                right = this._parseProjectionRHS(bindingPower.Star);
            }
            return {type: "ValueProjection", children: [left, right]};
          case TOK_FILTER:
            return this.led(token.type, {type: "Identity"});
          case TOK_LBRACE:
            return this._parseMultiselectHash();
          case TOK_FLATTEN:
            left = {type: TOK_FLATTEN, children: [{type: "Identity"}]};
            right = this._parseProjectionRHS(bindingPower.Flatten);
            return {type: "Projection", children: [left, right]};
          case TOK_LBRACKET:
            if (this._lookahead(0) === TOK_NUMBER || this._lookahead(0) === TOK_COLON) {
                right = this._parseIndexExpression();
                return this._projectIfSlice({type: "Identity"}, right);
            } else if (this._lookahead(0) === TOK_STAR &&
                       this._lookahead(1) === TOK_RBRACKET) {
                this._advance();
                this._advance();
                right = this._parseProjectionRHS(bindingPower.Star);
                return {type: "Projection",
                        children: [{type: "Identity"}, right]};
            } else {
                return this._parseMultiselectList();
            }
            break;
          case TOK_CURRENT:
            return {type: TOK_CURRENT};
          case TOK_EXPREF:
            expression = this.expression(bindingPower.Expref);
            return {type: "ExpressionReference", children: [expression]};
          case TOK_LPAREN:
            var args = [];
            while (this._lookahead(0) !== TOK_RPAREN) {
              if (this._lookahead(0) === TOK_CURRENT) {
                expression = {type: TOK_CURRENT};
                this._advance();
              } else {
                expression = this.expression(0);
              }
              args.push(expression);
            }
            this._match(TOK_RPAREN);
            return args[0];
          default:
            this._errorToken(token);
        }
      },

      led: function(tokenName, left) {
        var right;
        switch(tokenName) {
          case TOK_DOT:
            var rbp = bindingPower.Dot;
            if (this._lookahead(0) !== TOK_STAR) {
                right = this._parseDotRHS(rbp);
                return {type: "Subexpression", children: [left, right]};
            } else {
                this._advance();
                right = this._parseProjectionRHS(rbp);
                return {type: "ValueProjection", children: [left, right]};
            }
            break;
          case TOK_PIPE:
            right = this.expression(bindingPower.Pipe);
            return {type: TOK_PIPE, children: [left, right]};
          case TOK_OR:
            right = this.expression(bindingPower.Or);
            return {type: "OrExpression", children: [left, right]};
          case TOK_AND:
            right = this.expression(bindingPower.And);
            return {type: "AndExpression", children: [left, right]};
          case TOK_LPAREN:
            var name = left.name;
            var args = [];
            var expression, node;
            while (this._lookahead(0) !== TOK_RPAREN) {
              if (this._lookahead(0) === TOK_CURRENT) {
                expression = {type: TOK_CURRENT};
                this._advance();
              } else {
                expression = this.expression(0);
              }
              if (this._lookahead(0) === TOK_COMMA) {
                this._match(TOK_COMMA);
              }
              args.push(expression);
            }
            this._match(TOK_RPAREN);
            node = {type: "Function", name: name, children: args};
            return node;
          case TOK_FILTER:
            var condition = this.expression(0);
            this._match(TOK_RBRACKET);
            if (this._lookahead(0) === TOK_FLATTEN) {
              right = {type: "Identity"};
            } else {
              right = this._parseProjectionRHS(bindingPower.Filter);
            }
            return {type: "FilterProjection", children: [left, right, condition]};
          case TOK_FLATTEN:
            var leftNode = {type: TOK_FLATTEN, children: [left]};
            var rightNode = this._parseProjectionRHS(bindingPower.Flatten);
            return {type: "Projection", children: [leftNode, rightNode]};
          case TOK_EQ:
          case TOK_NE:
          case TOK_GT:
          case TOK_GTE:
          case TOK_LT:
          case TOK_LTE:
            return this._parseComparator(left, tokenName);
          case TOK_LBRACKET:
            var token = this._lookaheadToken(0);
            if (token.type === TOK_NUMBER || token.type === TOK_COLON) {
                right = this._parseIndexExpression();
                return this._projectIfSlice(left, right);
            } else {
                this._match(TOK_STAR);
                this._match(TOK_RBRACKET);
                right = this._parseProjectionRHS(bindingPower.Star);
                return {type: "Projection", children: [left, right]};
            }
            break;
          default:
            this._errorToken(this._lookaheadToken(0));
        }
      },

      _match: function(tokenType) {
          if (this._lookahead(0) === tokenType) {
              this._advance();
          } else {
              var t = this._lookaheadToken(0);
              var error = new Error("Expected " + tokenType + ", got: " + t.type);
              error.name = "ParserError";
              throw error;
          }
      },

      _errorToken: function(token) {
          var error = new Error("Invalid token (" +
                                token.type + "): \"" +
                                token.value + "\"");
          error.name = "ParserError";
          throw error;
      },


      _parseIndexExpression: function() {
          if (this._lookahead(0) === TOK_COLON || this._lookahead(1) === TOK_COLON) {
              return this._parseSliceExpression();
          } else {
              var node = {
                  type: "Index",
                  value: this._lookaheadToken(0).value};
              this._advance();
              this._match(TOK_RBRACKET);
              return node;
          }
      },

      _projectIfSlice: function(left, right) {
          var indexExpr = {type: "IndexExpression", children: [left, right]};
          if (right.type === "Slice") {
              return {
                  type: "Projection",
                  children: [indexExpr, this._parseProjectionRHS(bindingPower.Star)]
              };
          } else {
              return indexExpr;
          }
      },

      _parseSliceExpression: function() {
          var parts = [null, null, null];
          var index = 0;
          var currentToken = this._lookahead(0);
          while (currentToken !== TOK_RBRACKET && index < 3) {
              if (currentToken === TOK_COLON) {
                  index++;
                  this._advance();
              } else if (currentToken === TOK_NUMBER) {
                  parts[index] = this._lookaheadToken(0).value;
                  this._advance();
              } else {
                  var t = this._lookahead(0);
                  var error = new Error("Syntax error, unexpected token: " +
                                        t.value + "(" + t.type + ")");
                  error.name = "Parsererror";
                  throw error;
              }
              currentToken = this._lookahead(0);
          }
          this._match(TOK_RBRACKET);
          return {
              type: "Slice",
              children: parts
          };
      },

      _parseComparator: function(left, comparator) {
        var right = this.expression(bindingPower[comparator]);
        return {type: "Comparator", name: comparator, children: [left, right]};
      },

      _parseDotRHS: function(rbp) {
          var lookahead = this._lookahead(0);
          var exprTokens = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER, TOK_STAR];
          if (exprTokens.indexOf(lookahead) >= 0) {
              return this.expression(rbp);
          } else if (lookahead === TOK_LBRACKET) {
              this._match(TOK_LBRACKET);
              return this._parseMultiselectList();
          } else if (lookahead === TOK_LBRACE) {
              this._match(TOK_LBRACE);
              return this._parseMultiselectHash();
          }
      },

      _parseProjectionRHS: function(rbp) {
          var right;
          if (bindingPower[this._lookahead(0)] < 10) {
              right = {type: "Identity"};
          } else if (this._lookahead(0) === TOK_LBRACKET) {
              right = this.expression(rbp);
          } else if (this._lookahead(0) === TOK_FILTER) {
              right = this.expression(rbp);
          } else if (this._lookahead(0) === TOK_DOT) {
              this._match(TOK_DOT);
              right = this._parseDotRHS(rbp);
          } else {
              var t = this._lookaheadToken(0);
              var error = new Error("Sytanx error, unexpected token: " +
                                    t.value + "(" + t.type + ")");
              error.name = "ParserError";
              throw error;
          }
          return right;
      },

      _parseMultiselectList: function() {
          var expressions = [];
          while (this._lookahead(0) !== TOK_RBRACKET) {
              var expression = this.expression(0);
              expressions.push(expression);
              if (this._lookahead(0) === TOK_COMMA) {
                  this._match(TOK_COMMA);
                  if (this._lookahead(0) === TOK_RBRACKET) {
                    throw new Error("Unexpected token Rbracket");
                  }
              }
          }
          this._match(TOK_RBRACKET);
          return {type: "MultiSelectList", children: expressions};
      },

      _parseMultiselectHash: function() {
        var pairs = [];
        var identifierTypes = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER];
        var keyToken, keyName, value, node;
        for (;;) {
          keyToken = this._lookaheadToken(0);
          if (identifierTypes.indexOf(keyToken.type) < 0) {
            throw new Error("Expecting an identifier token, got: " +
                            keyToken.type);
          }
          keyName = keyToken.value;
          this._advance();
          this._match(TOK_COLON);
          value = this.expression(0);
          node = {type: "KeyValuePair", name: keyName, value: value};
          pairs.push(node);
          if (this._lookahead(0) === TOK_COMMA) {
            this._match(TOK_COMMA);
          } else if (this._lookahead(0) === TOK_RBRACE) {
            this._match(TOK_RBRACE);
            break;
          }
        }
        return {type: "MultiSelectHash", children: pairs};
      }
  };


  function TreeInterpreter(runtime) {
    this.runtime = runtime;
  }

  TreeInterpreter.prototype = {
      search: function(node, value) {
          return this.visit(node, value);
      },

      visit: function(node, value) {
          var matched, current, result, first, second, field, left, right, collected, i;
          switch (node.type) {
            case "Field":
              if (value === null ) {
                  return null;
              } else if (isObject(value)) {
                  field = value[node.name];
                  if (field === undefined) {
                      return null;
                  } else {
                      return field;
                  }
              } else {
                return null;
              }
              break;
            case "Subexpression":
              result = this.visit(node.children[0], value);
              for (i = 1; i < node.children.length; i++) {
                  result = this.visit(node.children[1], result);
                  if (result === null) {
                      return null;
                  }
              }
              return result;
            case "IndexExpression":
              left = this.visit(node.children[0], value);
              right = this.visit(node.children[1], left);
              return right;
            case "Index":
              if (!isArray(value)) {
                return null;
              }
              var index = node.value;
              if (index < 0) {
                index = value.length + index;
              }
              result = value[index];
              if (result === undefined) {
                result = null;
              }
              return result;
            case "Slice":
              if (!isArray(value)) {
                return null;
              }
              var sliceParams = node.children.slice(0);
              var computed = this.computeSliceParams(value.length, sliceParams);
              var start = computed[0];
              var stop = computed[1];
              var step = computed[2];
              result = [];
              if (step > 0) {
                  for (i = start; i < stop; i += step) {
                      result.push(value[i]);
                  }
              } else {
                  for (i = start; i > stop; i += step) {
                      result.push(value[i]);
                  }
              }
              return result;
            case "Projection":
              var base = this.visit(node.children[0], value);
              if (!isArray(base)) {
                return null;
              }
              collected = [];
              for (i = 0; i < base.length; i++) {
                current = this.visit(node.children[1], base[i]);
                if (current !== null) {
                  collected.push(current);
                }
              }
              return collected;
            case "ValueProjection":
              base = this.visit(node.children[0], value);
              if (!isObject(base)) {
                return null;
              }
              collected = [];
              var values = objValues(base);
              for (i = 0; i < values.length; i++) {
                current = this.visit(node.children[1], values[i]);
                if (current !== null) {
                  collected.push(current);
                }
              }
              return collected;
            case "FilterProjection":
              base = this.visit(node.children[0], value);
              if (!isArray(base)) {
                return null;
              }
              var filtered = [];
              var finalResults = [];
              for (i = 0; i < base.length; i++) {
                matched = this.visit(node.children[2], base[i]);
                if (!isFalse(matched)) {
                  filtered.push(base[i]);
                }
              }
              for (var j = 0; j < filtered.length; j++) {
                current = this.visit(node.children[1], filtered[j]);
                if (current !== null) {
                  finalResults.push(current);
                }
              }
              return finalResults;
            case "Comparator":
              first = this.visit(node.children[0], value);
              second = this.visit(node.children[1], value);
              switch(node.name) {
                case TOK_EQ:
                  result = strictDeepEqual(first, second);
                  break;
                case TOK_NE:
                  result = !strictDeepEqual(first, second);
                  break;
                case TOK_GT:
                  result = first > second;
                  break;
                case TOK_GTE:
                  result = first >= second;
                  break;
                case TOK_LT:
                  result = first < second;
                  break;
                case TOK_LTE:
                  result = first <= second;
                  break;
                default:
                  throw new Error("Unknown comparator: " + node.name);
              }
              return result;
            case TOK_FLATTEN:
              var original = this.visit(node.children[0], value);
              if (!isArray(original)) {
                return null;
              }
              var merged = [];
              for (i = 0; i < original.length; i++) {
                current = original[i];
                if (isArray(current)) {
                  merged.push.apply(merged, current);
                } else {
                  merged.push(current);
                }
              }
              return merged;
            case "Identity":
              return value;
            case "MultiSelectList":
              if (value === null) {
                return null;
              }
              collected = [];
              for (i = 0; i < node.children.length; i++) {
                  collected.push(this.visit(node.children[i], value));
              }
              return collected;
            case "MultiSelectHash":
              if (value === null) {
                return null;
              }
              collected = {};
              var child;
              for (i = 0; i < node.children.length; i++) {
                child = node.children[i];
                collected[child.name] = this.visit(child.value, value);
              }
              return collected;
            case "OrExpression":
              matched = this.visit(node.children[0], value);
              if (isFalse(matched)) {
                  matched = this.visit(node.children[1], value);
              }
              return matched;
            case "AndExpression":
              first = this.visit(node.children[0], value);

              if (isFalse(first) === true) {
                return first;
              }
              return this.visit(node.children[1], value);
            case "NotExpression":
              first = this.visit(node.children[0], value);
              return isFalse(first);
            case "Literal":
              return node.value;
            case TOK_PIPE:
              left = this.visit(node.children[0], value);
              return this.visit(node.children[1], left);
            case TOK_CURRENT:
              return value;
            case "Function":
              var resolvedArgs = [];
              for (i = 0; i < node.children.length; i++) {
                  resolvedArgs.push(this.visit(node.children[i], value));
              }
              return this.runtime.callFunction(node.name, resolvedArgs);
            case "ExpressionReference":
              var refNode = node.children[0];
              refNode.jmespathType = TOK_EXPREF;
              return refNode;
            default:
              throw new Error("Unknown node type: " + node.type);
          }
      },

      computeSliceParams: function(arrayLength, sliceParams) {
        var start = sliceParams[0];
        var stop = sliceParams[1];
        var step = sliceParams[2];
        var computed = [null, null, null];
        if (step === null) {
          step = 1;
        } else if (step === 0) {
          var error = new Error("Invalid slice, step cannot be 0");
          error.name = "RuntimeError";
          throw error;
        }
        var stepValueNegative = step < 0 ? true : false;

        if (start === null) {
            start = stepValueNegative ? arrayLength - 1 : 0;
        } else {
            start = this.capSliceRange(arrayLength, start, step);
        }

        if (stop === null) {
            stop = stepValueNegative ? -1 : arrayLength;
        } else {
            stop = this.capSliceRange(arrayLength, stop, step);
        }
        computed[0] = start;
        computed[1] = stop;
        computed[2] = step;
        return computed;
      },

      capSliceRange: function(arrayLength, actualValue, step) {
          if (actualValue < 0) {
              actualValue += arrayLength;
              if (actualValue < 0) {
                  actualValue = step < 0 ? -1 : 0;
              }
          } else if (actualValue >= arrayLength) {
              actualValue = step < 0 ? arrayLength - 1 : arrayLength;
          }
          return actualValue;
      }

  };

  function Runtime(interpreter) {
    this._interpreter = interpreter;
    this.functionTable = {
        abs: {_func: this._functionAbs, _signature: [{types: [TYPE_NUMBER]}]},
        avg: {_func: this._functionAvg, _signature: [{types: [TYPE_ARRAY_NUMBER]}]},
        ceil: {_func: this._functionCeil, _signature: [{types: [TYPE_NUMBER]}]},
        contains: {
            _func: this._functionContains,
            _signature: [{types: [TYPE_STRING, TYPE_ARRAY]},
                        {types: [TYPE_ANY]}]},
        "ends_with": {
            _func: this._functionEndsWith,
            _signature: [{types: [TYPE_STRING]}, {types: [TYPE_STRING]}]},
        floor: {_func: this._functionFloor, _signature: [{types: [TYPE_NUMBER]}]},
        length: {
            _func: this._functionLength,
            _signature: [{types: [TYPE_STRING, TYPE_ARRAY, TYPE_OBJECT]}]},
        map: {
            _func: this._functionMap,
            _signature: [{types: [TYPE_EXPREF]}, {types: [TYPE_ARRAY]}]},
        max: {
            _func: this._functionMax,
            _signature: [{types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING]}]},
        "merge": {
            _func: this._functionMerge,
            _signature: [{types: [TYPE_OBJECT], variadic: true}]
        },
        "max_by": {
          _func: this._functionMaxBy,
          _signature: [{types: [TYPE_ARRAY]}, {types: [TYPE_EXPREF]}]
        },
        sum: {_func: this._functionSum, _signature: [{types: [TYPE_ARRAY_NUMBER]}]},
        "starts_with": {
            _func: this._functionStartsWith,
            _signature: [{types: [TYPE_STRING]}, {types: [TYPE_STRING]}]},
        min: {
            _func: this._functionMin,
            _signature: [{types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING]}]},
        "min_by": {
          _func: this._functionMinBy,
          _signature: [{types: [TYPE_ARRAY]}, {types: [TYPE_EXPREF]}]
        },
        type: {_func: this._functionType, _signature: [{types: [TYPE_ANY]}]},
        keys: {_func: this._functionKeys, _signature: [{types: [TYPE_OBJECT]}]},
        values: {_func: this._functionValues, _signature: [{types: [TYPE_OBJECT]}]},
        sort: {_func: this._functionSort, _signature: [{types: [TYPE_ARRAY_STRING, TYPE_ARRAY_NUMBER]}]},
        "sort_by": {
          _func: this._functionSortBy,
          _signature: [{types: [TYPE_ARRAY]}, {types: [TYPE_EXPREF]}]
        },
        join: {
            _func: this._functionJoin,
            _signature: [
                {types: [TYPE_STRING]},
                {types: [TYPE_ARRAY_STRING]}
            ]
        },
        reverse: {
            _func: this._functionReverse,
            _signature: [{types: [TYPE_STRING, TYPE_ARRAY]}]},
        "to_array": {_func: this._functionToArray, _signature: [{types: [TYPE_ANY]}]},
        "to_string": {_func: this._functionToString, _signature: [{types: [TYPE_ANY]}]},
        "to_number": {_func: this._functionToNumber, _signature: [{types: [TYPE_ANY]}]},
        "not_null": {
            _func: this._functionNotNull,
            _signature: [{types: [TYPE_ANY], variadic: true}]
        }
    };
  }

  Runtime.prototype = {
    callFunction: function(name, resolvedArgs) {
      var functionEntry = this.functionTable[name];
      if (functionEntry === undefined) {
          throw new Error("Unknown function: " + name + "()");
      }
      this._validateArgs(name, resolvedArgs, functionEntry._signature);
      return functionEntry._func.call(this, resolvedArgs);
    },

    _validateArgs: function(name, args, signature) {
        var pluralized;
        if (signature[signature.length - 1].variadic) {
            if (args.length < signature.length) {
                pluralized = signature.length === 1 ? " argument" : " arguments";
                throw new Error("ArgumentError: " + name + "() " +
                                "takes at least" + signature.length + pluralized +
                                " but received " + args.length);
            }
        } else if (args.length !== signature.length) {
            pluralized = signature.length === 1 ? " argument" : " arguments";
            throw new Error("ArgumentError: " + name + "() " +
                            "takes " + signature.length + pluralized +
                            " but received " + args.length);
        }
        var currentSpec;
        var actualType;
        var typeMatched;
        for (var i = 0; i < signature.length; i++) {
            typeMatched = false;
            currentSpec = signature[i].types;
            actualType = this._getTypeName(args[i]);
            for (var j = 0; j < currentSpec.length; j++) {
                if (this._typeMatches(actualType, currentSpec[j], args[i])) {
                    typeMatched = true;
                    break;
                }
            }
            if (!typeMatched) {
                throw new Error("TypeError: " + name + "() " +
                                "expected argument " + (i + 1) +
                                " to be type " + currentSpec +
                                " but received type " + actualType +
                                " instead.");
            }
        }
    },

    _typeMatches: function(actual, expected, argValue) {
        if (expected === TYPE_ANY) {
            return true;
        }
        if (expected === TYPE_ARRAY_STRING ||
            expected === TYPE_ARRAY_NUMBER ||
            expected === TYPE_ARRAY) {
            if (expected === TYPE_ARRAY) {
                return actual === TYPE_ARRAY;
            } else if (actual === TYPE_ARRAY) {
                var subtype;
                if (expected === TYPE_ARRAY_NUMBER) {
                  subtype = TYPE_NUMBER;
                } else if (expected === TYPE_ARRAY_STRING) {
                  subtype = TYPE_STRING;
                }
                for (var i = 0; i < argValue.length; i++) {
                    if (!this._typeMatches(
                            this._getTypeName(argValue[i]), subtype,
                                             argValue[i])) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            return actual === expected;
        }
    },
    _getTypeName: function(obj) {
        switch (Object.prototype.toString.call(obj)) {
            case "[object String]":
              return TYPE_STRING;
            case "[object Number]":
              return TYPE_NUMBER;
            case "[object Array]":
              return TYPE_ARRAY;
            case "[object Boolean]":
              return TYPE_BOOLEAN;
            case "[object Null]":
              return TYPE_NULL;
            case "[object Object]":
              if (obj.jmespathType === TOK_EXPREF) {
                return TYPE_EXPREF;
              } else {
                return TYPE_OBJECT;
              }
        }
    },

    _functionStartsWith: function(resolvedArgs) {
        return resolvedArgs[0].lastIndexOf(resolvedArgs[1]) === 0;
    },

    _functionEndsWith: function(resolvedArgs) {
        var searchStr = resolvedArgs[0];
        var suffix = resolvedArgs[1];
        return searchStr.indexOf(suffix, searchStr.length - suffix.length) !== -1;
    },

    _functionReverse: function(resolvedArgs) {
        var typeName = this._getTypeName(resolvedArgs[0]);
        if (typeName === TYPE_STRING) {
          var originalStr = resolvedArgs[0];
          var reversedStr = "";
          for (var i = originalStr.length - 1; i >= 0; i--) {
              reversedStr += originalStr[i];
          }
          return reversedStr;
        } else {
          var reversedArray = resolvedArgs[0].slice(0);
          reversedArray.reverse();
          return reversedArray;
        }
    },

    _functionAbs: function(resolvedArgs) {
      return Math.abs(resolvedArgs[0]);
    },

    _functionCeil: function(resolvedArgs) {
        return Math.ceil(resolvedArgs[0]);
    },

    _functionAvg: function(resolvedArgs) {
        var sum = 0;
        var inputArray = resolvedArgs[0];
        for (var i = 0; i < inputArray.length; i++) {
            sum += inputArray[i];
        }
        return sum / inputArray.length;
    },

    _functionContains: function(resolvedArgs) {
        return resolvedArgs[0].indexOf(resolvedArgs[1]) >= 0;
    },

    _functionFloor: function(resolvedArgs) {
        return Math.floor(resolvedArgs[0]);
    },

    _functionLength: function(resolvedArgs) {
       if (!isObject(resolvedArgs[0])) {
         return resolvedArgs[0].length;
       } else {
         return Object.keys(resolvedArgs[0]).length;
       }
    },

    _functionMap: function(resolvedArgs) {
      var mapped = [];
      var interpreter = this._interpreter;
      var exprefNode = resolvedArgs[0];
      var elements = resolvedArgs[1];
      for (var i = 0; i < elements.length; i++) {
          mapped.push(interpreter.visit(exprefNode, elements[i]));
      }
      return mapped;
    },

    _functionMerge: function(resolvedArgs) {
      var merged = {};
      for (var i = 0; i < resolvedArgs.length; i++) {
        var current = resolvedArgs[i];
        for (var key in current) {
          merged[key] = current[key];
        }
      }
      return merged;
    },

    _functionMax: function(resolvedArgs) {
      if (resolvedArgs[0].length > 0) {
        var typeName = this._getTypeName(resolvedArgs[0][0]);
        if (typeName === TYPE_NUMBER) {
          return Math.max.apply(Math, resolvedArgs[0]);
        } else {
          var elements = resolvedArgs[0];
          var maxElement = elements[0];
          for (var i = 1; i < elements.length; i++) {
              if (maxElement.localeCompare(elements[i]) < 0) {
                  maxElement = elements[i];
              }
          }
          return maxElement;
        }
      } else {
          return null;
      }
    },

    _functionMin: function(resolvedArgs) {
      if (resolvedArgs[0].length > 0) {
        var typeName = this._getTypeName(resolvedArgs[0][0]);
        if (typeName === TYPE_NUMBER) {
          return Math.min.apply(Math, resolvedArgs[0]);
        } else {
          var elements = resolvedArgs[0];
          var minElement = elements[0];
          for (var i = 1; i < elements.length; i++) {
              if (elements[i].localeCompare(minElement) < 0) {
                  minElement = elements[i];
              }
          }
          return minElement;
        }
      } else {
        return null;
      }
    },

    _functionSum: function(resolvedArgs) {
      var sum = 0;
      var listToSum = resolvedArgs[0];
      for (var i = 0; i < listToSum.length; i++) {
        sum += listToSum[i];
      }
      return sum;
    },

    _functionType: function(resolvedArgs) {
        switch (this._getTypeName(resolvedArgs[0])) {
          case TYPE_NUMBER:
            return "number";
          case TYPE_STRING:
            return "string";
          case TYPE_ARRAY:
            return "array";
          case TYPE_OBJECT:
            return "object";
          case TYPE_BOOLEAN:
            return "boolean";
          case TYPE_EXPREF:
            return "expref";
          case TYPE_NULL:
            return "null";
        }
    },

    _functionKeys: function(resolvedArgs) {
        return Object.keys(resolvedArgs[0]);
    },

    _functionValues: function(resolvedArgs) {
        var obj = resolvedArgs[0];
        var keys = Object.keys(obj);
        var values = [];
        for (var i = 0; i < keys.length; i++) {
            values.push(obj[keys[i]]);
        }
        return values;
    },

    _functionJoin: function(resolvedArgs) {
        var joinChar = resolvedArgs[0];
        var listJoin = resolvedArgs[1];
        return listJoin.join(joinChar);
    },

    _functionToArray: function(resolvedArgs) {
        if (this._getTypeName(resolvedArgs[0]) === TYPE_ARRAY) {
            return resolvedArgs[0];
        } else {
            return [resolvedArgs[0]];
        }
    },

    _functionToString: function(resolvedArgs) {
        if (this._getTypeName(resolvedArgs[0]) === TYPE_STRING) {
            return resolvedArgs[0];
        } else {
            return JSON.stringify(resolvedArgs[0]);
        }
    },

    _functionToNumber: function(resolvedArgs) {
        var typeName = this._getTypeName(resolvedArgs[0]);
        var convertedValue;
        if (typeName === TYPE_NUMBER) {
            return resolvedArgs[0];
        } else if (typeName === TYPE_STRING) {
            convertedValue = +resolvedArgs[0];
            if (!isNaN(convertedValue)) {
                return convertedValue;
            }
        }
        return null;
    },

    _functionNotNull: function(resolvedArgs) {
        for (var i = 0; i < resolvedArgs.length; i++) {
            if (this._getTypeName(resolvedArgs[i]) !== TYPE_NULL) {
                return resolvedArgs[i];
            }
        }
        return null;
    },

    _functionSort: function(resolvedArgs) {
        var sortedArray = resolvedArgs[0].slice(0);
        sortedArray.sort();
        return sortedArray;
    },

    _functionSortBy: function(resolvedArgs) {
        var sortedArray = resolvedArgs[0].slice(0);
        if (sortedArray.length === 0) {
            return sortedArray;
        }
        var interpreter = this._interpreter;
        var exprefNode = resolvedArgs[1];
        var requiredType = this._getTypeName(
            interpreter.visit(exprefNode, sortedArray[0]));
        if ([TYPE_NUMBER, TYPE_STRING].indexOf(requiredType) < 0) {
            throw new Error("TypeError");
        }
        var that = this;
        var decorated = [];
        for (var i = 0; i < sortedArray.length; i++) {
          decorated.push([i, sortedArray[i]]);
        }
        decorated.sort(function(a, b) {
          var exprA = interpreter.visit(exprefNode, a[1]);
          var exprB = interpreter.visit(exprefNode, b[1]);
          if (that._getTypeName(exprA) !== requiredType) {
              throw new Error(
                  "TypeError: expected " + requiredType + ", received " +
                  that._getTypeName(exprA));
          } else if (that._getTypeName(exprB) !== requiredType) {
              throw new Error(
                  "TypeError: expected " + requiredType + ", received " +
                  that._getTypeName(exprB));
          }
          if (exprA > exprB) {
            return 1;
          } else if (exprA < exprB) {
            return -1;
          } else {
            return a[0] - b[0];
          }
        });
        for (var j = 0; j < decorated.length; j++) {
          sortedArray[j] = decorated[j][1];
        }
        return sortedArray;
    },

    _functionMaxBy: function(resolvedArgs) {
      var exprefNode = resolvedArgs[1];
      var resolvedArray = resolvedArgs[0];
      var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
      var maxNumber = -Infinity;
      var maxRecord;
      var current;
      for (var i = 0; i < resolvedArray.length; i++) {
        current = keyFunction(resolvedArray[i]);
        if (current > maxNumber) {
          maxNumber = current;
          maxRecord = resolvedArray[i];
        }
      }
      return maxRecord;
    },

    _functionMinBy: function(resolvedArgs) {
      var exprefNode = resolvedArgs[1];
      var resolvedArray = resolvedArgs[0];
      var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
      var minNumber = Infinity;
      var minRecord;
      var current;
      for (var i = 0; i < resolvedArray.length; i++) {
        current = keyFunction(resolvedArray[i]);
        if (current < minNumber) {
          minNumber = current;
          minRecord = resolvedArray[i];
        }
      }
      return minRecord;
    },

    createKeyFunction: function(exprefNode, allowedTypes) {
      var that = this;
      var interpreter = this._interpreter;
      var keyFunc = function(x) {
        var current = interpreter.visit(exprefNode, x);
        if (allowedTypes.indexOf(that._getTypeName(current)) < 0) {
          var msg = "TypeError: expected one of " + allowedTypes +
                    ", received " + that._getTypeName(current);
          throw new Error(msg);
        }
        return current;
      };
      return keyFunc;
    }

  };

  function compile(stream) {
    var parser = new Parser();
    var ast = parser.parse(stream);
    return ast;
  }

  function tokenize(stream) {
      var lexer = new Lexer();
      return lexer.tokenize(stream);
  }

  function search(data, expression) {
      var parser = new Parser();
      var runtime = new Runtime();
      var interpreter = new TreeInterpreter(runtime);
      runtime._interpreter = interpreter;
      var node = parser.parse(expression);
      return interpreter.search(node, data);
  }

  exports.tokenize = tokenize;
  exports.compile = compile;
  exports.search = search;
  exports.strictDeepEqual = strictDeepEqual;
})(typeof exports === "undefined" ? this.jmespath = {} : exports);

},{}],80:[function(require,module,exports){

'use strict';

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

},{}],81:[function(require,module,exports){

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).map(function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

},{}],82:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./decode":80,"./encode":81}],83:[function(require,module,exports){

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}


var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    autoEscape = ['\''].concat(unwise),
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {



    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    var auth, atSign;
    if (hostEnd === -1) {
      atSign = rest.lastIndexOf('@');
    } else {
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    this.parseHost();

    this.hostname = this.hostname || '';

    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  if (!unsafeProtocol[lowerProto]) {

    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  var hash = rest.indexOf('#');
  if (hash !== -1) {
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  this.href = this.format();
  return this;
};

function urlFormat(obj) {
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

  result.hash = relative.hash;

  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  if (relative.slashes && !relative.protocol) {
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
  } else if (relPath.length) {
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    result.pathname = null;
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

},{"punycode":63,"querystring":66}],84:[function(require,module,exports){
(function() {
  var XMLAttribute, create;

  create = require('lodash/object/create');

  module.exports = XMLAttribute = (function() {
    function XMLAttribute(parent, name, value) {
      this.stringify = parent.stringify;
      if (name == null) {
        throw new Error("Missing attribute name of element " + parent.name);
      }
      if (value == null) {
        throw new Error("Missing attribute value for attribute " + name + " of element " + parent.name);
      }
      this.name = this.stringify.attName(name);
      this.value = this.stringify.attValue(value);
    }

    XMLAttribute.prototype.clone = function() {
      return create(XMLAttribute.prototype, this);
    };

    XMLAttribute.prototype.toString = function(options, level) {
      return ' ' + this.name + '="' + this.value + '"';
    };

    return XMLAttribute;

  })();

}).call(this);

},{"lodash/object/create":143}],85:[function(require,module,exports){
(function() {
  var XMLBuilder, XMLDeclaration, XMLDocType, XMLElement, XMLStringifier;

  XMLStringifier = require('./XMLStringifier');

  XMLDeclaration = require('./XMLDeclaration');

  XMLDocType = require('./XMLDocType');

  XMLElement = require('./XMLElement');

  module.exports = XMLBuilder = (function() {
    function XMLBuilder(name, options) {
      var root, temp;
      if (name == null) {
        throw new Error("Root element needs a name");
      }
      if (options == null) {
        options = {};
      }
      this.options = options;
      this.stringify = new XMLStringifier(options);
      temp = new XMLElement(this, 'doc');
      root = temp.element(name);
      root.isRoot = true;
      root.documentObject = this;
      this.rootObject = root;
      if (!options.headless) {
        root.declaration(options);
        if ((options.pubID != null) || (options.sysID != null)) {
          root.doctype(options);
        }
      }
    }

    XMLBuilder.prototype.root = function() {
      return this.rootObject;
    };

    XMLBuilder.prototype.end = function(options) {
      return this.toString(options);
    };

    XMLBuilder.prototype.toString = function(options) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      r = '';
      if (this.xmldec != null) {
        r += this.xmldec.toString(options);
      }
      if (this.doctype != null) {
        r += this.doctype.toString(options);
      }
      r += this.rootObject.toString(options);
      if (pretty && r.slice(-newline.length) === newline) {
        r = r.slice(0, -newline.length);
      }
      return r;
    };

    return XMLBuilder;

  })();

}).call(this);

},{"./XMLDeclaration":92,"./XMLDocType":93,"./XMLElement":94,"./XMLStringifier":98}],86:[function(require,module,exports){
(function() {
  var XMLCData, XMLNode, create,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  create = require('lodash/object/create');

  XMLNode = require('./XMLNode');

  module.exports = XMLCData = (function(superClass) {
    extend(XMLCData, superClass);

    function XMLCData(parent, text) {
      XMLCData.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing CDATA text");
      }
      this.text = this.stringify.cdata(text);
    }

    XMLCData.prototype.clone = function() {
      return create(XMLCData.prototype, this);
    };

    XMLCData.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += '<![CDATA[' + this.text + ']]>';
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLCData;

  })(XMLNode);

}).call(this);

},{"./XMLNode":95,"lodash/object/create":143}],87:[function(require,module,exports){
(function() {
  var XMLComment, XMLNode, create,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  create = require('lodash/object/create');

  XMLNode = require('./XMLNode');

  module.exports = XMLComment = (function(superClass) {
    extend(XMLComment, superClass);

    function XMLComment(parent, text) {
      XMLComment.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing comment text");
      }
      this.text = this.stringify.comment(text);
    }

    XMLComment.prototype.clone = function() {
      return create(XMLComment.prototype, this);
    };

    XMLComment.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += '<!-- ' + this.text + ' -->';
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLComment;

  })(XMLNode);

}).call(this);

},{"./XMLNode":95,"lodash/object/create":143}],88:[function(require,module,exports){
(function() {
  var XMLDTDAttList, create;

  create = require('lodash/object/create');

  module.exports = XMLDTDAttList = (function() {
    function XMLDTDAttList(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      this.stringify = parent.stringify;
      if (elementName == null) {
        throw new Error("Missing DTD element name");
      }
      if (attributeName == null) {
        throw new Error("Missing DTD attribute name");
      }
      if (!attributeType) {
        throw new Error("Missing DTD attribute type");
      }
      if (!defaultValueType) {
        throw new Error("Missing DTD attribute default");
      }
      if (defaultValueType.indexOf('#') !== 0) {
        defaultValueType = '#' + defaultValueType;
      }
      if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
        throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT");
      }
      if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
        throw new Error("Default value only applies to #FIXED or #DEFAULT");
      }
      this.elementName = this.stringify.eleName(elementName);
      this.attributeName = this.stringify.attName(attributeName);
      this.attributeType = this.stringify.dtdAttType(attributeType);
      this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
      this.defaultValueType = defaultValueType;
    }

    XMLDTDAttList.prototype.clone = function() {
      return create(XMLDTDAttList.prototype, this);
    };

    XMLDTDAttList.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += '<!ATTLIST ' + this.elementName + ' ' + this.attributeName + ' ' + this.attributeType;
      if (this.defaultValueType !== '#DEFAULT') {
        r += ' ' + this.defaultValueType;
      }
      if (this.defaultValue) {
        r += ' "' + this.defaultValue + '"';
      }
      r += '>';
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLDTDAttList;

  })();

}).call(this);

},{"lodash/object/create":143}],89:[function(require,module,exports){
(function() {
  var XMLDTDElement, create, isArray;

  create = require('lodash/object/create');

  isArray = require('lodash/lang/isArray');

  module.exports = XMLDTDElement = (function() {
    function XMLDTDElement(parent, name, value) {
      this.stringify = parent.stringify;
      if (name == null) {
        throw new Error("Missing DTD element name");
      }
      if (!value) {
        value = '(#PCDATA)';
      }
      if (isArray(value)) {
        value = '(' + value.join(',') + ')';
      }
      this.name = this.stringify.eleName(name);
      this.value = this.stringify.dtdElementValue(value);
    }

    XMLDTDElement.prototype.clone = function() {
      return create(XMLDTDElement.prototype, this);
    };

    XMLDTDElement.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += '<!ELEMENT ' + this.name + ' ' + this.value + '>';
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLDTDElement;

  })();

}).call(this);

},{"lodash/lang/isArray":135,"lodash/object/create":143}],90:[function(require,module,exports){
(function() {
  var XMLDTDEntity, create, isObject;

  create = require('lodash/object/create');

  isObject = require('lodash/lang/isObject');

  module.exports = XMLDTDEntity = (function() {
    function XMLDTDEntity(parent, pe, name, value) {
      this.stringify = parent.stringify;
      if (name == null) {
        throw new Error("Missing entity name");
      }
      if (value == null) {
        throw new Error("Missing entity value");
      }
      this.pe = !!pe;
      this.name = this.stringify.eleName(name);
      if (!isObject(value)) {
        this.value = this.stringify.dtdEntityValue(value);
      } else {
        if (!value.pubID && !value.sysID) {
          throw new Error("Public and/or system identifiers are required for an external entity");
        }
        if (value.pubID && !value.sysID) {
          throw new Error("System identifier is required for a public external entity");
        }
        if (value.pubID != null) {
          this.pubID = this.stringify.dtdPubID(value.pubID);
        }
        if (value.sysID != null) {
          this.sysID = this.stringify.dtdSysID(value.sysID);
        }
        if (value.nData != null) {
          this.nData = this.stringify.dtdNData(value.nData);
        }
        if (this.pe && this.nData) {
          throw new Error("Notation declaration is not allowed in a parameter entity");
        }
      }
    }

    XMLDTDEntity.prototype.clone = function() {
      return create(XMLDTDEntity.prototype, this);
    };

    XMLDTDEntity.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += '<!ENTITY';
      if (this.pe) {
        r += ' %';
      }
      r += ' ' + this.name;
      if (this.value) {
        r += ' "' + this.value + '"';
      } else {
        if (this.pubID && this.sysID) {
          r += ' PUBLIC "' + this.pubID + '" "' + this.sysID + '"';
        } else if (this.sysID) {
          r += ' SYSTEM "' + this.sysID + '"';
        }
        if (this.nData) {
          r += ' NDATA ' + this.nData;
        }
      }
      r += '>';
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLDTDEntity;

  })();

}).call(this);

},{"lodash/lang/isObject":139,"lodash/object/create":143}],91:[function(require,module,exports){
(function() {
  var XMLDTDNotation, create;

  create = require('lodash/object/create');

  module.exports = XMLDTDNotation = (function() {
    function XMLDTDNotation(parent, name, value) {
      this.stringify = parent.stringify;
      if (name == null) {
        throw new Error("Missing notation name");
      }
      if (!value.pubID && !value.sysID) {
        throw new Error("Public or system identifiers are required for an external entity");
      }
      this.name = this.stringify.eleName(name);
      if (value.pubID != null) {
        this.pubID = this.stringify.dtdPubID(value.pubID);
      }
      if (value.sysID != null) {
        this.sysID = this.stringify.dtdSysID(value.sysID);
      }
    }

    XMLDTDNotation.prototype.clone = function() {
      return create(XMLDTDNotation.prototype, this);
    };

    XMLDTDNotation.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += '<!NOTATION ' + this.name;
      if (this.pubID && this.sysID) {
        r += ' PUBLIC "' + this.pubID + '" "' + this.sysID + '"';
      } else if (this.pubID) {
        r += ' PUBLIC "' + this.pubID + '"';
      } else if (this.sysID) {
        r += ' SYSTEM "' + this.sysID + '"';
      }
      r += '>';
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLDTDNotation;

  })();

}).call(this);

},{"lodash/object/create":143}],92:[function(require,module,exports){
(function() {
  var XMLDeclaration, XMLNode, create, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  create = require('lodash/object/create');

  isObject = require('lodash/lang/isObject');

  XMLNode = require('./XMLNode');

  module.exports = XMLDeclaration = (function(superClass) {
    extend(XMLDeclaration, superClass);

    function XMLDeclaration(parent, version, encoding, standalone) {
      var ref;
      XMLDeclaration.__super__.constructor.call(this, parent);
      if (isObject(version)) {
        ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
      }
      if (!version) {
        version = '1.0';
      }
      if (version != null) {
        this.version = this.stringify.xmlVersion(version);
      }
      if (encoding != null) {
        this.encoding = this.stringify.xmlEncoding(encoding);
      }
      if (standalone != null) {
        this.standalone = this.stringify.xmlStandalone(standalone);
      }
    }

    XMLDeclaration.prototype.clone = function() {
      return create(XMLDeclaration.prototype, this);
    };

    XMLDeclaration.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += '<?xml';
      if (this.version != null) {
        r += ' version="' + this.version + '"';
      }
      if (this.encoding != null) {
        r += ' encoding="' + this.encoding + '"';
      }
      if (this.standalone != null) {
        r += ' standalone="' + this.standalone + '"';
      }
      r += '?>';
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLDeclaration;

  })(XMLNode);

}).call(this);

},{"./XMLNode":95,"lodash/lang/isObject":139,"lodash/object/create":143}],93:[function(require,module,exports){
(function() {
  var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLProcessingInstruction, create, isObject;

  create = require('lodash/object/create');

  isObject = require('lodash/lang/isObject');

  XMLCData = require('./XMLCData');

  XMLComment = require('./XMLComment');

  XMLDTDAttList = require('./XMLDTDAttList');

  XMLDTDEntity = require('./XMLDTDEntity');

  XMLDTDElement = require('./XMLDTDElement');

  XMLDTDNotation = require('./XMLDTDNotation');

  XMLProcessingInstruction = require('./XMLProcessingInstruction');

  module.exports = XMLDocType = (function() {
    function XMLDocType(parent, pubID, sysID) {
      var ref, ref1;
      this.documentObject = parent;
      this.stringify = this.documentObject.stringify;
      this.children = [];
      if (isObject(pubID)) {
        ref = pubID, pubID = ref.pubID, sysID = ref.sysID;
      }
      if (sysID == null) {
        ref1 = [pubID, sysID], sysID = ref1[0], pubID = ref1[1];
      }
      if (pubID != null) {
        this.pubID = this.stringify.dtdPubID(pubID);
      }
      if (sysID != null) {
        this.sysID = this.stringify.dtdSysID(sysID);
      }
    }

    XMLDocType.prototype.clone = function() {
      return create(XMLDocType.prototype, this);
    };

    XMLDocType.prototype.element = function(name, value) {
      var child;
      child = new XMLDTDElement(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var child;
      child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.entity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, false, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.pEntity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, true, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.notation = function(name, value) {
      var child;
      child = new XMLDTDNotation(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.cdata = function(value) {
      var child;
      child = new XMLCData(this, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.comment = function(value) {
      var child;
      child = new XMLComment(this, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.instruction = function(target, value) {
      var child;
      child = new XMLProcessingInstruction(this, target, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.root = function() {
      return this.documentObject.root();
    };

    XMLDocType.prototype.document = function() {
      return this.documentObject;
    };

    XMLDocType.prototype.toString = function(options, level) {
      var child, i, indent, len, newline, offset, pretty, r, ref, ref1, ref2, ref3, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += '<!DOCTYPE ' + this.root().name;
      if (this.pubID && this.sysID) {
        r += ' PUBLIC "' + this.pubID + '" "' + this.sysID + '"';
      } else if (this.sysID) {
        r += ' SYSTEM "' + this.sysID + '"';
      }
      if (this.children.length > 0) {
        r += ' [';
        if (pretty) {
          r += newline;
        }
        ref3 = this.children;
        for (i = 0, len = ref3.length; i < len; i++) {
          child = ref3[i];
          r += child.toString(options, level + 1);
        }
        r += ']';
      }
      r += '>';
      if (pretty) {
        r += newline;
      }
      return r;
    };

    XMLDocType.prototype.ele = function(name, value) {
      return this.element(name, value);
    };

    XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
    };

    XMLDocType.prototype.ent = function(name, value) {
      return this.entity(name, value);
    };

    XMLDocType.prototype.pent = function(name, value) {
      return this.pEntity(name, value);
    };

    XMLDocType.prototype.not = function(name, value) {
      return this.notation(name, value);
    };

    XMLDocType.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLDocType.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLDocType.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLDocType.prototype.up = function() {
      return this.root();
    };

    XMLDocType.prototype.doc = function() {
      return this.document();
    };

    return XMLDocType;

  })();

}).call(this);

},{"./XMLCData":86,"./XMLComment":87,"./XMLDTDAttList":88,"./XMLDTDElement":89,"./XMLDTDEntity":90,"./XMLDTDNotation":91,"./XMLProcessingInstruction":96,"lodash/lang/isObject":139,"lodash/object/create":143}],94:[function(require,module,exports){
(function() {
  var XMLAttribute, XMLElement, XMLNode, XMLProcessingInstruction, create, every, isArray, isFunction, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  create = require('lodash/object/create');

  isObject = require('lodash/lang/isObject');

  isArray = require('lodash/lang/isArray');

  isFunction = require('lodash/lang/isFunction');

  every = require('lodash/collection/every');

  XMLNode = require('./XMLNode');

  XMLAttribute = require('./XMLAttribute');

  XMLProcessingInstruction = require('./XMLProcessingInstruction');

  module.exports = XMLElement = (function(superClass) {
    extend(XMLElement, superClass);

    function XMLElement(parent, name, attributes) {
      XMLElement.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing element name");
      }
      this.name = this.stringify.eleName(name);
      this.children = [];
      this.instructions = [];
      this.attributes = {};
      if (attributes != null) {
        this.attribute(attributes);
      }
    }

    XMLElement.prototype.clone = function() {
      var att, attName, clonedSelf, i, len, pi, ref, ref1;
      clonedSelf = create(XMLElement.prototype, this);
      if (clonedSelf.isRoot) {
        clonedSelf.documentObject = null;
      }
      clonedSelf.attributes = {};
      ref = this.attributes;
      for (attName in ref) {
        if (!hasProp.call(ref, attName)) continue;
        att = ref[attName];
        clonedSelf.attributes[attName] = att.clone();
      }
      clonedSelf.instructions = [];
      ref1 = this.instructions;
      for (i = 0, len = ref1.length; i < len; i++) {
        pi = ref1[i];
        clonedSelf.instructions.push(pi.clone());
      }
      clonedSelf.children = [];
      this.children.forEach(function(child) {
        var clonedChild;
        clonedChild = child.clone();
        clonedChild.parent = clonedSelf;
        return clonedSelf.children.push(clonedChild);
      });
      return clonedSelf;
    };

    XMLElement.prototype.attribute = function(name, value) {
      var attName, attValue;
      if (name != null) {
        name = name.valueOf();
      }
      if (isObject(name)) {
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (!this.options.skipNullAttributes || (value != null)) {
          this.attributes[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    };

    XMLElement.prototype.removeAttribute = function(name) {
      var attName, i, len;
      if (name == null) {
        throw new Error("Missing attribute name");
      }
      name = name.valueOf();
      if (isArray(name)) {
        for (i = 0, len = name.length; i < len; i++) {
          attName = name[i];
          delete this.attributes[attName];
        }
      } else {
        delete this.attributes[name];
      }
      return this;
    };

    XMLElement.prototype.instruction = function(target, value) {
      var i, insTarget, insValue, instruction, len;
      if (target != null) {
        target = target.valueOf();
      }
      if (value != null) {
        value = value.valueOf();
      }
      if (isArray(target)) {
        for (i = 0, len = target.length; i < len; i++) {
          insTarget = target[i];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) {
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        instruction = new XMLProcessingInstruction(this, target, value);
        this.instructions.push(instruction);
      }
      return this;
    };

    XMLElement.prototype.toString = function(options, level) {
      var att, child, i, indent, instruction, j, len, len1, name, newline, offset, pretty, r, ref, ref1, ref2, ref3, ref4, ref5, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      ref3 = this.instructions;
      for (i = 0, len = ref3.length; i < len; i++) {
        instruction = ref3[i];
        r += instruction.toString(options, level + 1);
      }
      if (pretty) {
        r += space;
      }
      r += '<' + this.name;
      ref4 = this.attributes;
      for (name in ref4) {
        if (!hasProp.call(ref4, name)) continue;
        att = ref4[name];
        r += att.toString(options);
      }
      if (this.children.length === 0 || every(this.children, function(e) {
        return e.value === '';
      })) {
        r += '/>';
        if (pretty) {
          r += newline;
        }
      } else if (pretty && this.children.length === 1 && (this.children[0].value != null)) {
        r += '>';
        r += this.children[0].value;
        r += '</' + this.name + '>';
        r += newline;
      } else {
        r += '>';
        if (pretty) {
          r += newline;
        }
        ref5 = this.children;
        for (j = 0, len1 = ref5.length; j < len1; j++) {
          child = ref5[j];
          r += child.toString(options, level + 1);
        }
        if (pretty) {
          r += space;
        }
        r += '</' + this.name + '>';
        if (pretty) {
          r += newline;
        }
      }
      return r;
    };

    XMLElement.prototype.att = function(name, value) {
      return this.attribute(name, value);
    };

    XMLElement.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLElement.prototype.a = function(name, value) {
      return this.attribute(name, value);
    };

    XMLElement.prototype.i = function(target, value) {
      return this.instruction(target, value);
    };

    return XMLElement;

  })(XMLNode);

}).call(this);

},{"./XMLAttribute":84,"./XMLNode":95,"./XMLProcessingInstruction":96,"lodash/collection/every":101,"lodash/lang/isArray":135,"lodash/lang/isFunction":137,"lodash/lang/isObject":139,"lodash/object/create":143}],95:[function(require,module,exports){
(function() {
  var XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLElement, XMLNode, XMLRaw, XMLText, isArray, isEmpty, isFunction, isObject,
    hasProp = {}.hasOwnProperty;

  isObject = require('lodash/lang/isObject');

  isArray = require('lodash/lang/isArray');

  isFunction = require('lodash/lang/isFunction');

  isEmpty = require('lodash/lang/isEmpty');

  XMLElement = null;

  XMLCData = null;

  XMLComment = null;

  XMLDeclaration = null;

  XMLDocType = null;

  XMLRaw = null;

  XMLText = null;

  module.exports = XMLNode = (function() {
    function XMLNode(parent) {
      this.parent = parent;
      this.options = this.parent.options;
      this.stringify = this.parent.stringify;
      if (XMLElement === null) {
        XMLElement = require('./XMLElement');
        XMLCData = require('./XMLCData');
        XMLComment = require('./XMLComment');
        XMLDeclaration = require('./XMLDeclaration');
        XMLDocType = require('./XMLDocType');
        XMLRaw = require('./XMLRaw');
        XMLText = require('./XMLText');
      }
    }

    XMLNode.prototype.clone = function() {
      throw new Error("Cannot clone generic XMLNode");
    };

    XMLNode.prototype.element = function(name, attributes, text) {
      var item, j, key, lastChild, len, ref, val;
      lastChild = null;
      if (attributes == null) {
        attributes = {};
      }
      attributes = attributes.valueOf();
      if (!isObject(attributes)) {
        ref = [attributes, text], text = ref[0], attributes = ref[1];
      }
      if (name != null) {
        name = name.valueOf();
      }
      if (isArray(name)) {
        for (j = 0, len = name.length; j < len; j++) {
          item = name[j];
          lastChild = this.element(item);
        }
      } else if (isFunction(name)) {
        lastChild = this.element(name.apply());
      } else if (isObject(name)) {
        for (key in name) {
          if (!hasProp.call(name, key)) continue;
          val = name[key];
          if (isFunction(val)) {
            val = val.apply();
          }
          if ((isObject(val)) && (isEmpty(val))) {
            val = null;
          }
          if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
            lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
          } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && key.indexOf(this.stringify.convertPIKey) === 0) {
            lastChild = this.instruction(key.substr(this.stringify.convertPIKey.length), val);
          } else if (isObject(val)) {
            if (!this.options.ignoreDecorators && this.stringify.convertListKey && key.indexOf(this.stringify.convertListKey) === 0 && isArray(val)) {
              lastChild = this.element(val);
            } else {
              lastChild = this.element(key);
              lastChild.element(val);
            }
          } else {
            lastChild = this.element(key, val);
          }
        }
      } else {
        if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
          lastChild = this.text(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
          lastChild = this.cdata(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
          lastChild = this.comment(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
          lastChild = this.raw(text);
        } else {
          lastChild = this.node(name, attributes, text);
        }
      }
      if (lastChild == null) {
        throw new Error("Could not create any elements with: " + name);
      }
      return lastChild;
    };

    XMLNode.prototype.insertBefore = function(name, attributes, text) {
      var child, i, removed;
      if (this.isRoot) {
        throw new Error("Cannot insert elements at root level");
      }
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.element(name, attributes, text);
      Array.prototype.push.apply(this.parent.children, removed);
      return child;
    };

    XMLNode.prototype.insertAfter = function(name, attributes, text) {
      var child, i, removed;
      if (this.isRoot) {
        throw new Error("Cannot insert elements at root level");
      }
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.element(name, attributes, text);
      Array.prototype.push.apply(this.parent.children, removed);
      return child;
    };

    XMLNode.prototype.remove = function() {
      var i, ref;
      if (this.isRoot) {
        throw new Error("Cannot remove the root element");
      }
      i = this.parent.children.indexOf(this);
      [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref = [])), ref;
      return this.parent;
    };

    XMLNode.prototype.node = function(name, attributes, text) {
      var child, ref;
      if (name != null) {
        name = name.valueOf();
      }
      if (attributes == null) {
        attributes = {};
      }
      attributes = attributes.valueOf();
      if (!isObject(attributes)) {
        ref = [attributes, text], text = ref[0], attributes = ref[1];
      }
      child = new XMLElement(this, name, attributes);
      if (text != null) {
        child.text(text);
      }
      this.children.push(child);
      return child;
    };

    XMLNode.prototype.text = function(value) {
      var child;
      child = new XMLText(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.cdata = function(value) {
      var child;
      child = new XMLCData(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.comment = function(value) {
      var child;
      child = new XMLComment(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.raw = function(value) {
      var child;
      child = new XMLRaw(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.declaration = function(version, encoding, standalone) {
      var doc, xmldec;
      doc = this.document();
      xmldec = new XMLDeclaration(doc, version, encoding, standalone);
      doc.xmldec = xmldec;
      return doc.root();
    };

    XMLNode.prototype.doctype = function(pubID, sysID) {
      var doc, doctype;
      doc = this.document();
      doctype = new XMLDocType(doc, pubID, sysID);
      doc.doctype = doctype;
      return doctype;
    };

    XMLNode.prototype.up = function() {
      if (this.isRoot) {
        throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
      }
      return this.parent;
    };

    XMLNode.prototype.root = function() {
      var child;
      if (this.isRoot) {
        return this;
      }
      child = this.parent;
      while (!child.isRoot) {
        child = child.parent;
      }
      return child;
    };

    XMLNode.prototype.document = function() {
      return this.root().documentObject;
    };

    XMLNode.prototype.end = function(options) {
      return this.document().toString(options);
    };

    XMLNode.prototype.prev = function() {
      var i;
      if (this.isRoot) {
        throw new Error("Root node has no siblings");
      }
      i = this.parent.children.indexOf(this);
      if (i < 1) {
        throw new Error("Already at the first node");
      }
      return this.parent.children[i - 1];
    };

    XMLNode.prototype.next = function() {
      var i;
      if (this.isRoot) {
        throw new Error("Root node has no siblings");
      }
      i = this.parent.children.indexOf(this);
      if (i === -1 || i === this.parent.children.length - 1) {
        throw new Error("Already at the last node");
      }
      return this.parent.children[i + 1];
    };

    XMLNode.prototype.importXMLBuilder = function(xmlbuilder) {
      var clonedRoot;
      clonedRoot = xmlbuilder.root().clone();
      clonedRoot.parent = this;
      clonedRoot.isRoot = false;
      this.children.push(clonedRoot);
      return this;
    };

    XMLNode.prototype.ele = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.nod = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.txt = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.doc = function() {
      return this.document();
    };

    XMLNode.prototype.dec = function(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    };

    XMLNode.prototype.dtd = function(pubID, sysID) {
      return this.doctype(pubID, sysID);
    };

    XMLNode.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.n = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.t = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.d = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.c = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.r = function(value) {
      return this.raw(value);
    };

    XMLNode.prototype.u = function() {
      return this.up();
    };

    return XMLNode;

  })();

}).call(this);

},{"./XMLCData":86,"./XMLComment":87,"./XMLDeclaration":92,"./XMLDocType":93,"./XMLElement":94,"./XMLRaw":97,"./XMLText":99,"lodash/lang/isArray":135,"lodash/lang/isEmpty":136,"lodash/lang/isFunction":137,"lodash/lang/isObject":139}],96:[function(require,module,exports){
(function() {
  var XMLProcessingInstruction, create;

  create = require('lodash/object/create');

  module.exports = XMLProcessingInstruction = (function() {
    function XMLProcessingInstruction(parent, target, value) {
      this.stringify = parent.stringify;
      if (target == null) {
        throw new Error("Missing instruction target");
      }
      this.target = this.stringify.insTarget(target);
      if (value) {
        this.value = this.stringify.insValue(value);
      }
    }

    XMLProcessingInstruction.prototype.clone = function() {
      return create(XMLProcessingInstruction.prototype, this);
    };

    XMLProcessingInstruction.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += '<?';
      r += this.target;
      if (this.value) {
        r += ' ' + this.value;
      }
      r += '?>';
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLProcessingInstruction;

  })();

}).call(this);

},{"lodash/object/create":143}],97:[function(require,module,exports){
(function() {
  var XMLNode, XMLRaw, create,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  create = require('lodash/object/create');

  XMLNode = require('./XMLNode');

  module.exports = XMLRaw = (function(superClass) {
    extend(XMLRaw, superClass);

    function XMLRaw(parent, text) {
      XMLRaw.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing raw text");
      }
      this.value = this.stringify.raw(text);
    }

    XMLRaw.prototype.clone = function() {
      return create(XMLRaw.prototype, this);
    };

    XMLRaw.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += this.value;
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLRaw;

  })(XMLNode);

}).call(this);

},{"./XMLNode":95,"lodash/object/create":143}],98:[function(require,module,exports){
(function() {
  var XMLStringifier,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    hasProp = {}.hasOwnProperty;

  module.exports = XMLStringifier = (function() {
    function XMLStringifier(options) {
      this.assertLegalChar = bind(this.assertLegalChar, this);
      var key, ref, value;
      this.allowSurrogateChars = options != null ? options.allowSurrogateChars : void 0;
      ref = (options != null ? options.stringify : void 0) || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this[key] = value;
      }
    }

    XMLStringifier.prototype.eleName = function(val) {
      val = '' + val || '';
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.eleText = function(val) {
      val = '' + val || '';
      return this.assertLegalChar(this.elEscape(val));
    };

    XMLStringifier.prototype.cdata = function(val) {
      val = '' + val || '';
      if (val.match(/]]>/)) {
        throw new Error("Invalid CDATA text: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.comment = function(val) {
      val = '' + val || '';
      if (val.match(/--/)) {
        throw new Error("Comment text cannot contain double-hypen: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.raw = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.attName = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.attValue = function(val) {
      val = '' + val || '';
      return this.attEscape(val);
    };

    XMLStringifier.prototype.insTarget = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.insValue = function(val) {
      val = '' + val || '';
      if (val.match(/\?>/)) {
        throw new Error("Invalid processing instruction value: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlVersion = function(val) {
      val = '' + val || '';
      if (!val.match(/1\.[0-9]+/)) {
        throw new Error("Invalid version number: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlEncoding = function(val) {
      val = '' + val || '';
      if (!val.match(/[A-Za-z](?:[A-Za-z0-9._-]|-)*/)) {
        throw new Error("Invalid encoding: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlStandalone = function(val) {
      if (val) {
        return "yes";
      } else {
        return "no";
      }
    };

    XMLStringifier.prototype.dtdPubID = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdSysID = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdElementValue = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdAttType = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdAttDefault = function(val) {
      if (val != null) {
        return '' + val || '';
      } else {
        return val;
      }
    };

    XMLStringifier.prototype.dtdEntityValue = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdNData = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.convertAttKey = '@';

    XMLStringifier.prototype.convertPIKey = '?';

    XMLStringifier.prototype.convertTextKey = '#text';

    XMLStringifier.prototype.convertCDataKey = '#cdata';

    XMLStringifier.prototype.convertCommentKey = '#comment';

    XMLStringifier.prototype.convertRawKey = '#raw';

    XMLStringifier.prototype.convertListKey = '#list';

    XMLStringifier.prototype.assertLegalChar = function(str) {
      var chars, chr;
      if (this.allowSurrogateChars) {
        chars = /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uFFFE-\uFFFF]/;
      } else {
        chars = /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE-\uFFFF]/;
      }
      chr = str.match(chars);
      if (chr) {
        throw new Error("Invalid character (" + chr + ") in string: " + str + " at index " + chr.index);
      }
      return str;
    };

    XMLStringifier.prototype.elEscape = function(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
    };

    XMLStringifier.prototype.attEscape = function(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
    };

    return XMLStringifier;

  })();

}).call(this);

},{}],99:[function(require,module,exports){
(function() {
  var XMLNode, XMLText, create,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  create = require('lodash/object/create');

  XMLNode = require('./XMLNode');

  module.exports = XMLText = (function(superClass) {
    extend(XMLText, superClass);

    function XMLText(parent, text) {
      XMLText.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing element text");
      }
      this.value = this.stringify.eleText(text);
    }

    XMLText.prototype.clone = function() {
      return create(XMLText.prototype, this);
    };

    XMLText.prototype.toString = function(options, level) {
      var indent, newline, offset, pretty, r, ref, ref1, ref2, space;
      pretty = (options != null ? options.pretty : void 0) || false;
      indent = (ref = options != null ? options.indent : void 0) != null ? ref : '  ';
      offset = (ref1 = options != null ? options.offset : void 0) != null ? ref1 : 0;
      newline = (ref2 = options != null ? options.newline : void 0) != null ? ref2 : '\n';
      level || (level = 0);
      space = new Array(level + offset + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      r += this.value;
      if (pretty) {
        r += newline;
      }
      return r;
    };

    return XMLText;

  })(XMLNode);

}).call(this);

},{"./XMLNode":95,"lodash/object/create":143}],100:[function(require,module,exports){
(function() {
  var XMLBuilder, assign;

  assign = require('lodash/object/assign');

  XMLBuilder = require('./XMLBuilder');

  module.exports.create = function(name, xmldec, doctype, options) {
    options = assign({}, xmldec, doctype, options);
    return new XMLBuilder(name, options).root();
  };

}).call(this);

},{"./XMLBuilder":85,"lodash/object/assign":142}],101:[function(require,module,exports){
var arrayEvery = require('../internal/arrayEvery'),
    baseCallback = require('../internal/baseCallback'),
    baseEvery = require('../internal/baseEvery'),
    isArray = require('../lang/isArray');


function every(collection, predicate, thisArg) {
  var func = isArray(collection) ? arrayEvery : baseEvery;
  if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
    predicate = baseCallback(predicate, thisArg, 3);
  }
  return func(collection, predicate);
}

module.exports = every;

},{"../internal/arrayEvery":102,"../internal/baseCallback":104,"../internal/baseEvery":108,"../lang/isArray":135}],102:[function(require,module,exports){

function arrayEvery(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }
  return true;
}

module.exports = arrayEvery;

},{}],103:[function(require,module,exports){
var baseCopy = require('./baseCopy'),
    keys = require('../object/keys');


function baseAssign(object, source, customizer) {
  var props = keys(source);
  if (!customizer) {
    return baseCopy(source, object, props);
  }
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (typeof value == 'undefined' && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

module.exports = baseAssign;

},{"../object/keys":144,"./baseCopy":105}],104:[function(require,module,exports){
var baseMatches = require('./baseMatches'),
    baseMatchesProperty = require('./baseMatchesProperty'),
    baseProperty = require('./baseProperty'),
    bindCallback = require('./bindCallback'),
    identity = require('../utility/identity'),
    isBindable = require('./isBindable');


function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return (typeof thisArg != 'undefined' && isBindable(func))
      ? bindCallback(func, thisArg, argCount)
      : func;
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return typeof thisArg == 'undefined'
    ? baseProperty(func + '')
    : baseMatchesProperty(func + '', thisArg);
}

module.exports = baseCallback;

},{"../utility/identity":148,"./baseMatches":115,"./baseMatchesProperty":116,"./baseProperty":117,"./bindCallback":120,"./isBindable":125}],105:[function(require,module,exports){

function baseCopy(source, object, props) {
  if (!props) {
    props = object;
    object = {};
  }
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],106:[function(require,module,exports){
(function (global){
var isObject = require('../lang/isObject');


var baseCreate = (function() {
  function Object() {}
  return function(prototype) {
    if (isObject(prototype)) {
      Object.prototype = prototype;
      var result = new Object;
      Object.prototype = null;
    }
    return result || global.Object();
  };
}());

module.exports = baseCreate;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lang/isObject":139}],107:[function(require,module,exports){
var baseForOwn = require('./baseForOwn'),
    isLength = require('./isLength'),
    toObject = require('./toObject');


function baseEach(collection, iteratee) {
  var length = collection ? collection.length : 0;
  if (!isLength(length)) {
    return baseForOwn(collection, iteratee);
  }
  var index = -1,
      iterable = toObject(collection);

  while (++index < length) {
    if (iteratee(iterable[index], index, iterable) === false) {
      break;
    }
  }
  return collection;
}

module.exports = baseEach;

},{"./baseForOwn":110,"./isLength":128,"./toObject":133}],108:[function(require,module,exports){
var baseEach = require('./baseEach');


function baseEvery(collection, predicate) {
  var result = true;
  baseEach(collection, function(value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}

module.exports = baseEvery;

},{"./baseEach":107}],109:[function(require,module,exports){
var toObject = require('./toObject');


function baseFor(object, iteratee, keysFunc) {
  var index = -1,
      iterable = toObject(object),
      props = keysFunc(object),
      length = props.length;

  while (++index < length) {
    var key = props[index];
    if (iteratee(iterable[key], key, iterable) === false) {
      break;
    }
  }
  return object;
}

module.exports = baseFor;

},{"./toObject":133}],110:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');


function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":144,"./baseFor":109}],111:[function(require,module,exports){
var baseIsEqualDeep = require('./baseIsEqualDeep');


function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
  if (value === other) {
    return value !== 0 || (1 / value == 1 / other);
  }
  var valType = typeof value,
      othType = typeof other;

  if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
      value == null || other == null) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isWhere, stackA, stackB);
}

module.exports = baseIsEqual;

},{"./baseIsEqualDeep":112}],112:[function(require,module,exports){
var equalArrays = require('./equalArrays'),
    equalByTag = require('./equalByTag'),
    equalObjects = require('./equalObjects'),
    isArray = require('../lang/isArray'),
    isTypedArray = require('../lang/isTypedArray');


var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';


var objectProto = Object.prototype;


var hasOwnProperty = objectProto.hasOwnProperty;


var objToString = objectProto.toString;


function baseIsEqualDeep(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
      othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

  if (valWrapped || othWrapped) {
    return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isWhere, stackA, stackB);
  }
  if (!isSameTag) {
    return false;
  }
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isWhere, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

module.exports = baseIsEqualDeep;

},{"../lang/isArray":135,"../lang/isTypedArray":141,"./equalArrays":122,"./equalByTag":123,"./equalObjects":124}],113:[function(require,module,exports){

function baseIsFunction(value) {
  return typeof value == 'function' || false;
}

module.exports = baseIsFunction;

},{}],114:[function(require,module,exports){
var baseIsEqual = require('./baseIsEqual');


var objectProto = Object.prototype;


var hasOwnProperty = objectProto.hasOwnProperty;


function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
  var length = props.length;
  if (object == null) {
    return !length;
  }
  var index = -1,
      noCustomizer = !customizer;

  while (++index < length) {
    if ((noCustomizer && strictCompareFlags[index])
          ? values[index] !== object[props[index]]
          : !hasOwnProperty.call(object, props[index])
        ) {
      return false;
    }
  }
  index = -1;
  while (++index < length) {
    var key = props[index];
    if (noCustomizer && strictCompareFlags[index]) {
      var result = hasOwnProperty.call(object, key);
    } else {
      var objValue = object[key],
          srcValue = values[index];

      result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (typeof result == 'undefined') {
        result = baseIsEqual(srcValue, objValue, customizer, true);
      }
    }
    if (!result) {
      return false;
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./baseIsEqual":111}],115:[function(require,module,exports){
var baseIsMatch = require('./baseIsMatch'),
    isStrictComparable = require('./isStrictComparable'),
    keys = require('../object/keys');


var objectProto = Object.prototype;


var hasOwnProperty = objectProto.hasOwnProperty;


function baseMatches(source) {
  var props = keys(source),
      length = props.length;

  if (length == 1) {
    var key = props[0],
        value = source[key];

    if (isStrictComparable(value)) {
      return function(object) {
        return object != null && object[key] === value && hasOwnProperty.call(object, key);
      };
    }
  }
  var values = Array(length),
      strictCompareFlags = Array(length);

  while (length--) {
    value = source[props[length]];
    values[length] = value;
    strictCompareFlags[length] = isStrictComparable(value);
  }
  return function(object) {
    return baseIsMatch(object, props, values, strictCompareFlags);
  };
}

module.exports = baseMatches;

},{"../object/keys":144,"./baseIsMatch":114,"./isStrictComparable":130}],116:[function(require,module,exports){
var baseIsEqual = require('./baseIsEqual'),
    isStrictComparable = require('./isStrictComparable');


function baseMatchesProperty(key, value) {
  if (isStrictComparable(value)) {
    return function(object) {
      return object != null && object[key] === value;
    };
  }
  return function(object) {
    return object != null && baseIsEqual(value, object[key], null, true);
  };
}

module.exports = baseMatchesProperty;

},{"./baseIsEqual":111,"./isStrictComparable":130}],117:[function(require,module,exports){

function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],118:[function(require,module,exports){
var identity = require('../utility/identity'),
    metaMap = require('./metaMap');


var baseSetData = !metaMap ? identity : function(func, data) {
  metaMap.set(func, data);
  return func;
};

module.exports = baseSetData;

},{"../utility/identity":148,"./metaMap":131}],119:[function(require,module,exports){

function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],120:[function(require,module,exports){
var identity = require('../utility/identity');


function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (typeof thisArg == 'undefined') {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":148}],121:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isIterateeCall = require('./isIterateeCall');


function createAssigner(assigner) {
  return function() {
    var args = arguments,
        length = args.length,
        object = args[0];

    if (length < 2 || object == null) {
      return object;
    }
    var customizer = args[length - 2],
        thisArg = args[length - 1],
        guard = args[3];

    if (length > 3 && typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = (length > 2 && typeof thisArg == 'function') ? thisArg : null;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(args[1], args[2], guard)) {
      customizer = length == 3 ? null : customizer;
      length = 2;
    }
    var index = 0;
    while (++index < length) {
      var source = args[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  };
}

module.exports = createAssigner;

},{"./bindCallback":120,"./isIterateeCall":127}],122:[function(require,module,exports){

function equalArrays(array, other, equalFunc, customizer, isWhere, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length,
      result = true;

  if (arrLength != othLength && !(isWhere && othLength > arrLength)) {
    return false;
  }
  while (result && ++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    result = undefined;
    if (customizer) {
      result = isWhere
        ? customizer(othValue, arrValue, index)
        : customizer(arrValue, othValue, index);
    }
    if (typeof result == 'undefined') {
      if (isWhere) {
        var othIndex = othLength;
        while (othIndex--) {
          othValue = other[othIndex];
          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
          if (result) {
            break;
          }
        }
      } else {
        result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
      }
    }
  }
  return !!result;
}

module.exports = equalArrays;

},{}],123:[function(require,module,exports){

var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';


function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      return (object != +object)
        ? other != +other
        : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

    case regexpTag:
    case stringTag:
      return object == (other + '');
  }
  return false;
}

module.exports = equalByTag;

},{}],124:[function(require,module,exports){
var keys = require('../object/keys');


var objectProto = Object.prototype;


var hasOwnProperty = objectProto.hasOwnProperty;


function equalObjects(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isWhere) {
    return false;
  }
  var hasCtor,
      index = -1;

  while (++index < objLength) {
    var key = objProps[index],
        result = hasOwnProperty.call(other, key);

    if (result) {
      var objValue = object[key],
          othValue = other[key];

      result = undefined;
      if (customizer) {
        result = isWhere
          ? customizer(othValue, objValue, key)
          : customizer(objValue, othValue, key);
      }
      if (typeof result == 'undefined') {
        result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isWhere, stackA, stackB);
      }
    }
    if (!result) {
      return false;
    }
    hasCtor || (hasCtor = key == 'constructor');
  }
  if (!hasCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = equalObjects;

},{"../object/keys":144}],125:[function(require,module,exports){
var baseSetData = require('./baseSetData'),
    isNative = require('../lang/isNative'),
    support = require('../support');


var reFuncName = /^\s*function[ \n\r\t]+\w/;


var reThis = /\bthis\b/;


var fnToString = Function.prototype.toString;


function isBindable(func) {
  var result = !(support.funcNames ? func.name : support.funcDecomp);

  if (!result) {
    var source = fnToString.call(func);
    if (!support.funcNames) {
      result = !reFuncName.test(source);
    }
    if (!result) {
      result = reThis.test(source) || isNative(func);
      baseSetData(func, result);
    }
  }
  return result;
}

module.exports = isBindable;

},{"../lang/isNative":138,"../support":147,"./baseSetData":118}],126:[function(require,module,exports){

var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;


function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],127:[function(require,module,exports){
var isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    isObject = require('../lang/isObject');


function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number') {
    var length = object.length,
        prereq = isLength(length) && isIndex(index, length);
  } else {
    prereq = type == 'string' && index in object;
  }
  if (prereq) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":139,"./isIndex":126,"./isLength":128}],128:[function(require,module,exports){

var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;


function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],129:[function(require,module,exports){

function isObjectLike(value) {
  return (value && typeof value == 'object') || false;
}

module.exports = isObjectLike;

},{}],130:[function(require,module,exports){
var isObject = require('../lang/isObject');


function isStrictComparable(value) {
  return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
}

module.exports = isStrictComparable;

},{"../lang/isObject":139}],131:[function(require,module,exports){
(function (global){
var isNative = require('../lang/isNative');


var WeakMap = isNative(WeakMap = global.WeakMap) && WeakMap;


var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lang/isNative":138}],132:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn'),
    support = require('../support');


var objectProto = Object.prototype;


var hasOwnProperty = objectProto.hasOwnProperty;


function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object)));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":134,"../lang/isArray":135,"../object/keysIn":145,"../support":147,"./isIndex":126,"./isLength":128}],133:[function(require,module,exports){
var isObject = require('../lang/isObject');


function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":139}],134:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');


var argsTag = '[object Arguments]';


var objectProto = Object.prototype;


var objToString = objectProto.toString;


function isArguments(value) {
  var length = isObjectLike(value) ? value.length : undefined;
  return (isLength(length) && objToString.call(value) == argsTag) || false;
}

module.exports = isArguments;

},{"../internal/isLength":128,"../internal/isObjectLike":129}],135:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isNative = require('./isNative'),
    isObjectLike = require('../internal/isObjectLike');


var arrayTag = '[object Array]';


var objectProto = Object.prototype;


var objToString = objectProto.toString;


var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;


var isArray = nativeIsArray || function(value) {
  return (isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag) || false;
};

module.exports = isArray;

},{"../internal/isLength":128,"../internal/isObjectLike":129,"./isNative":138}],136:[function(require,module,exports){
var isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isFunction = require('./isFunction'),
    isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike'),
    isString = require('./isString'),
    keys = require('../object/keys');


function isEmpty(value) {
  if (value == null) {
    return true;
  }
  var length = value.length;
  if (isLength(length) && (isArray(value) || isString(value) || isArguments(value) ||
      (isObjectLike(value) && isFunction(value.splice)))) {
    return !length;
  }
  return !keys(value).length;
}

module.exports = isEmpty;

},{"../internal/isLength":128,"../internal/isObjectLike":129,"../object/keys":144,"./isArguments":134,"./isArray":135,"./isFunction":137,"./isString":140}],137:[function(require,module,exports){
(function (global){
var baseIsFunction = require('../internal/baseIsFunction'),
    isNative = require('./isNative');


var funcTag = '[object Function]';


var objectProto = Object.prototype;


var objToString = objectProto.toString;


var Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;


var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
  return objToString.call(value) == funcTag;
};

module.exports = isFunction;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../internal/baseIsFunction":113,"./isNative":138}],138:[function(require,module,exports){
var escapeRegExp = require('../string/escapeRegExp'),
    isObjectLike = require('../internal/isObjectLike');


var funcTag = '[object Function]';


var reHostCtor = /^\[object .+?Constructor\]$/;


var objectProto = Object.prototype;


var fnToString = Function.prototype.toString;


var objToString = objectProto.toString;


var reNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);


function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reNative.test(fnToString.call(value));
  }
  return (isObjectLike(value) && reHostCtor.test(value)) || false;
}

module.exports = isNative;

},{"../internal/isObjectLike":129,"../string/escapeRegExp":146}],139:[function(require,module,exports){

function isObject(value) {
  var type = typeof value;
  return type == 'function' || (value && type == 'object') || false;
}

module.exports = isObject;

},{}],140:[function(require,module,exports){
var isObjectLike = require('../internal/isObjectLike');


var stringTag = '[object String]';


var objectProto = Object.prototype;


var objToString = objectProto.toString;


function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag) || false;
}

module.exports = isString;

},{"../internal/isObjectLike":129}],141:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');


var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';


var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;


var objectProto = Object.prototype;


var objToString = objectProto.toString;


function isTypedArray(value) {
  return (isObjectLike(value) && isLength(value.length) && typedArrayTags[objToString.call(value)]) || false;
}

module.exports = isTypedArray;

},{"../internal/isLength":128,"../internal/isObjectLike":129}],142:[function(require,module,exports){
var baseAssign = require('../internal/baseAssign'),
    createAssigner = require('../internal/createAssigner');


var assign = createAssigner(baseAssign);

module.exports = assign;

},{"../internal/baseAssign":103,"../internal/createAssigner":121}],143:[function(require,module,exports){
var baseCopy = require('../internal/baseCopy'),
    baseCreate = require('../internal/baseCreate'),
    isIterateeCall = require('../internal/isIterateeCall'),
    keys = require('./keys');


function create(prototype, properties, guard) {
  var result = baseCreate(prototype);
  if (guard && isIterateeCall(prototype, properties, guard)) {
    properties = null;
  }
  return properties ? baseCopy(properties, result, keys(properties)) : result;
}

module.exports = create;

},{"../internal/baseCopy":105,"../internal/baseCreate":106,"../internal/isIterateeCall":127,"./keys":144}],144:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isNative = require('../lang/isNative'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');


var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;


var keys = !nativeKeys ? shimKeys : function(object) {
  if (object) {
    var Ctor = object.constructor,
        length = object.length;
  }
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && (length && isLength(length)))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/isLength":128,"../internal/shimKeys":132,"../lang/isNative":138,"../lang/isObject":139}],145:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject'),
    support = require('../support');


var objectProto = Object.prototype;


var hasOwnProperty = objectProto.hasOwnProperty;


function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":126,"../internal/isLength":128,"../lang/isArguments":134,"../lang/isArray":135,"../lang/isObject":139,"../support":147}],146:[function(require,module,exports){
var baseToString = require('../internal/baseToString');


var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);


function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = escapeRegExp;

},{"../internal/baseToString":119}],147:[function(require,module,exports){
(function (global){
var isNative = require('./lang/isNative');


var reThis = /\bthis\b/;


var objectProto = Object.prototype;


var document = (document = global.window) && document.document;


var propertyIsEnumerable = objectProto.propertyIsEnumerable;


var support = {};

(function(x) {


  support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });


  support.funcNames = typeof Function.name == 'string';


  try {
    support.dom = document.createDocumentFragment().nodeType === 11;
  } catch(e) {
    support.dom = false;
  }


  try {
    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
  } catch(e) {
    support.nonEnumArgs = true;
  }
}(0, 0));

module.exports = support;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lang/isNative":138}],148:[function(require,module,exports){

function identity(value) {
  return value;
}

module.exports = identity;

},{}]},{},[8])

