export interface userInfo {
	email: string,
     id: number,
     first_name: string,
     last_name: string,
     auth_token: string
}

export interface p2pInfo {
     uid: number,
     company_name:string,
     nickname: string
}

export interface accountInfo {
     account_holder : string,
     account_number : string,
     bank : string,
     deposit : string
}

export interface fundInfo {
     total_investment: string, 
     number_of_investing_products: string, 
     residual_investment_price: string 
}