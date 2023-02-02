import { AmountType } from "@/common/types/data-prop-types";

export interface AccountInfoResposne {
	status: string;
	address: string;
	coins: string;
	publicKey: {
		"@type": string;
		value: string;
	};
	accountNumber: number;
	sequence: number;
	chainId: string;
}
