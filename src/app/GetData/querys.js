class query {
    constructor(){
        this.host = {
            name:"corona.lmao.ninja",
            protocol:"https",
            getHost:() => `${this.host.protocol}://${this.host.name}/`
        };
        this.headers = {
            "Content-Type":"application/json"
        };
    }

    getAllCountries(){
        return fetch(`${this.host.getHost()}countries`,this.headers)
        .then(res => res.json())
        .then(data => Promise.resolve(data))
        .catch(error => Promise.resolve({isError:true,error:error}))
    }

    setQuery(obj){
        if(typeof obj === "object" && Array.isArray(obj) === false){
            var urlQuery = Object.keys(obj)
            .map(k => k+'='+obj[k])
            .join('&');
            return urlQuery;
        }else return "";
    }
}

export default query;