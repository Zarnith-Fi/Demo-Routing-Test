export type TestRouter = {
    "version": "0.1.0",
    "name": "test_router",
    "instructions": [
      {
        "name": "initializeRouter",
        "accounts": [
          {
            "name": "router",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "destinations",
            "type": {
              "vec": {
                "defined": "FeeDestination"
              }
            }
          }
        ]
      },
      {
        "name": "updateDestinations",
        "accounts": [
          {
            "name": "router",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "newDestinations",
            "type": {
              "vec": {
                "defined": "FeeDestination"
              }
            }
          }
        ]
      },
      {
        "name": "routeSolFees",
        "accounts": [
          {
            "name": "router",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "sender",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "closeRouter",
        "accounts": [
          {
            "name": "router",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "router",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "destinations",
              "type": {
                "vec": {
                  "defined": "FeeDestination"
                }
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "FeeDestination",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "address",
              "type": "publicKey"
            },
            {
              "name": "percentage",
              "type": "u16"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Unauthorized",
        "msg": "You are not authorized to perform this action"
      },
      {
        "code": 6001,
        "name": "NoDestinations",
        "msg": "No destinations provided"
      },
      {
        "code": 6002,
        "name": "InvalidTotalPercentage",
        "msg": "Total percentage must equal 10000 (100%)"
      },
      {
        "code": 6003,
        "name": "InsufficientDestinationAccounts",
        "msg": "Insufficient destination accounts provided"
      },
      {
        "code": 6004,
        "name": "DestinationMismatch",
        "msg": "Destination account does not match address in router"
      }
    ]
  };
  
  export const IDL: TestRouter = {
    "version": "0.1.0",
    "name": "test_router",
    "instructions": [
      {
        "name": "initializeRouter",
        "accounts": [
          {
            "name": "router",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "destinations",
            "type": {
              "vec": {
                "defined": "FeeDestination"
              }
            }
          }
        ]
      },
      {
        "name": "updateDestinations",
        "accounts": [
          {
            "name": "router",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "newDestinations",
            "type": {
              "vec": {
                "defined": "FeeDestination"
              }
            }
          }
        ]
      },
      {
        "name": "routeSolFees",
        "accounts": [
          {
            "name": "router",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "sender",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "closeRouter",
        "accounts": [
          {
            "name": "router",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "router",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "destinations",
              "type": {
                "vec": {
                  "defined": "FeeDestination"
                }
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "FeeDestination",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "address",
              "type": "publicKey"
            },
            {
              "name": "percentage",
              "type": "u16"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Unauthorized",
        "msg": "You are not authorized to perform this action"
      },
      {
        "code": 6001,
        "name": "NoDestinations",
        "msg": "No destinations provided"
      },
      {
        "code": 6002,
        "name": "InvalidTotalPercentage",
        "msg": "Total percentage must equal 10000 (100%)"
      },
      {
        "code": 6003,
        "name": "InsufficientDestinationAccounts",
        "msg": "Insufficient destination accounts provided"
      },
      {
        "code": 6004,
        "name": "DestinationMismatch",
        "msg": "Destination account does not match address in router"
      }
    ]
  };