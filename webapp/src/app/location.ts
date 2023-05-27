export interface Coordinates {
	lat: number,
	lon: number
}

export interface Location {
	location: Coordinates,
	address: string,
	timestamp: number
}

export interface LocationsResponse {
	list: Location[],
	status: string,
	self_address: string
}