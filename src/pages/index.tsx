import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountInfoModel } from "@/models/account/account-info-model";
import React, { useContext, useEffect, useState } from "react";
import { AccountHistoryModel } from "@/models/account/account-history-model";
import BigNumber from "bignumber.js";
import { generateId } from "@/common/utils/test-util";

export default function Home() {
	const [accountInfo, setAccountInfo] = useState<AccountInfoModel>();
	const [history, setHistory] = useState<any>();

	const {
		accountService,
		accountRepository,
		tokenService,
		tokenRepository,
		swapService,
	} = useGnoswapContext();

	const onClickGetAccountButton = () => {
		accountService.getAccountInfo().then(res => console.log("account : ", res));
	};

	const onClickGetHistoryButton = () => {
		accountRepository
			.getNotificationsByAddress("address")
			.then(res => console.log("connectAdenaWallet : ", res));
		// accountRepository
		// 	.getTransactions("123")
		// 	.then(res => console.log("history : ", res));
	};

	const onClickCreateHistory = () => {
		accountRepository
			.createNotification("address", {
				txHash: generateId(),
				status: "SUCCESS",
				tokenInfo: {
					amount: {
						value: BigNumber(0),
						denom: "ugnot",
					},
					tokenId: "1",
					name: "sfsfs",
					symbol: "asdfasdf",
				},
				txType: 0,
				createdAt: "",
			})
			.then(res => console.log("connectAdenaWallet : ", res));
		// accountRepository
		// 	.getTransactions("123")
		// 	.then(res => console.log("history : ", res));
	};

	const onClickTokenDatatable = () => {
		tokenService.getTokenDatatable().then(res => console.log("tegst : ", res));
	};

	const onClickPopularTokens = () => {
		tokenService
			.getPopularTokens()
			.then(res => console.log("Popular Tokens : ", res));
	};

	const onClickHighestTokens = () => {
		tokenService
			.getHighestRewardTokens()
			.then(res => console.log("Highest Tokens : ", res));
	};

	const onClickRecentlyTokens = () => {
		tokenService
			.getRecentlyAddedTokens()
			.then(res => console.log("Recently Tokens : ", res));
	};

	const onClickSearchToken = () => {
		tokenService
			.getSearchTokenDatatable({ keyword: "Gno", type: "ALL" })
			.then(res => console.log("Search Token : ", res));
	};

	const onClickExchangeRates = () => {
		tokenService
			.getAllExchangeRates("1")
			.then(res => console.log("Exchange Rates : ", res));
	};

	const onClickUSDExchangeRate = () => {
		tokenService
			.getUSDExchangeRate("1")
			.then(res => console.log("USD Exchange Rate : ", res));
	};

	const onClickAllTokenMeta = () => {
		tokenRepository
			.getAllTokenMetas()
			.then(res => console.log("Token Metas : ", res));
	};

	const onClickExpectedSwapResult = () => {
		// swapService
		// 	.getExpectedSwapResult("1", "1", "1", "1")
		// 	.then(res => console.log("Expected Swap : ", res));
	};

	return (
		<div style={{ padding: "3rem" }}>
			<button onClick={onClickGetAccountButton}>아데나 회원정보 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickGetHistoryButton}>히스토리 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickCreateHistory}>히스토리 생성</button>
			<br /> <br /> <br />
			<button onClick={onClickTokenDatatable}>토큰 데이터테이블 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickPopularTokens}>Popular Tokens 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickHighestTokens}>Highest Tokens 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickRecentlyTokens}>Recently Tokens 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickSearchToken}>토큰 검색</button>
			<br /> <br /> <br />
			<button onClick={onClickExchangeRates}>Exchange Rates 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickUSDExchangeRate}>USD Exchange Rate 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickAllTokenMeta}>Token Meta 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickExpectedSwapResult}>Swap 예상 결과 조회</button>
		</div>
	);
}
