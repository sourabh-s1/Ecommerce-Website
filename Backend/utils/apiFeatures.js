class ApiFeatures {
	constructor(query, queryStr){
		this.query = query;
		this.queryStr = queryStr;
	}

	search(){
		const keyword = this.queryStr.keyword ? {
			name: {
				$regex: this.queryStr.keyword,

				//force case sensitive check removed (this will now allow to find keywords with same name neglecting all case sensitiveness)
				$options: "i",
			},
		} : {};
		console.log(keyword);

		this.query = this.query.find({...keyword})
		return this;
	}

	filter(){
		//If we dont use spread operator it will just reffer to original query and if make any changes to new query it will also change in original query
		const queryCopy = {...this.queryStr};

		//Removing some fields for category
		const removeFields = ["keyword","page","limit"];
		removeFields.forEach(key => delete queryCopy[key]);

		//converting query into string to add "$" symbol in front of operator(eg. gt => $gt) by using regex (regular expressions)
		let queryStr = JSON.stringify(queryCopy);
		queryStr = queryStr.replace(/\b[gt||gte||lt||lte]/g,(key) => `$${key}`);

		this.query = this.query.find(JSON.parse(queryStr));

		return this
	}

	pagination(resultPerPage){
		const currentPage = Number(this.queryStr.page) || 1;

		const skip = (currentPage - 1) * resultPerPage;

		this.query = this.query.limit(resultPerPage).skip(skip);

		return this
	}
}

module.exports = ApiFeatures;