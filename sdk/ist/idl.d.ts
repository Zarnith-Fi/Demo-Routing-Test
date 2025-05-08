export declare const IDL: {
    version: string;
    name: string;
    address: string;
    metadata: {
        name: string;
        version: string;
        spec: string;
        description: string;
    };
    instructions: ({
        name: string;
        accounts: {
            name: string;
            isMut: boolean;
            isSigner: boolean;
        }[];
        args: {
            name: string;
            type: {
                vec: {
                    defined: string;
                };
            };
        }[];
    } | {
        name: string;
        accounts: {
            name: string;
            isMut: boolean;
            isSigner: boolean;
        }[];
        args: {
            name: string;
            type: string;
        }[];
    })[];
    accounts: {
        name: string;
        type: {
            kind: string;
            fields: ({
                name: string;
                type: string;
            } | {
                name: string;
                type: {
                    vec: {
                        defined: string;
                    };
                };
            })[];
        };
    }[];
    types: {
        name: string;
        type: {
            kind: string;
            fields: {
                name: string;
                type: string;
            }[];
        };
    }[];
    errors: {
        code: number;
        name: string;
        msg: string;
    }[];
};
