export const getLiferayAuthenticationToken = () => {
	try {
		// eslint-disable-next-line no-undef
		const token = Liferay.authToken;

		return token;
	} catch (error) {
		//console.warn('Not able to find Liferay auth token\n', error);
		return '';
	}
};

export const getLiferayLanguagePreference = () => {
	try {
		// eslint-disable-next-line no-undef
		const language = Liferay.ThemeDisplay.getLanguageId();

		return language.replace("_","-");
	} catch (error) {
		//console.warn('Not able to find Liferay auth token\n', error);
		return '';
	}
};

const baseFetch = async (url, {body, method = 'GET'} = {}) => {

    let headers = new Headers({
		'Content-Type': 'application/json',
		'Accept-Language': getLiferayLanguagePreference(),
		'x-csrf-token': getLiferayAuthenticationToken()
	})

	let apiPath = "http://localhost:8080";

	if(document.getElementsByTagName("lxc-bookmarks")[0].getAttribute("defaultapiroot")!==null){
		apiPath = document.getElementsByTagName("lxc-bookmarks")[0].getAttribute("defaultapiroot");
	}

	if(apiPath==="auto"){
		apiPath = window.location.origin;
	}

	// Basic Auth for local development testing only
	// Auth token is the best method for live use and
	// is available when acting as a Web Component (Custom Element)

	if (getLiferayAuthenticationToken()===""){
		headers = new Headers({
	    	'Authorization': 'Basic ' + btoa('test@liferay.com:portal4all'), 
			'Content-Type': 'application/json'
	    });
	}

	const response = await fetch(apiPath + url, {
		...(body && {body: JSON.stringify(body)}),
		headers: headers,
		method,
	});

	const data = await response.json();

	return {data};
};


export default baseFetch;
