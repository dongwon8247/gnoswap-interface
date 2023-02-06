export interface SummaryPopularTokenListResponse {
	hits: number;
	total: number;
	tokens: Array<PopularTokenInfo>;
}

interface PopularTokenInfo {
	token_id: string;
	name: string;
	symbol: string;
	change_24h: string;
}