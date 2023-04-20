const serverlessClient = require("serverless-postgres");

const client = new serverlessClient({
    user:"postgres",
    host: "localhost",
    database: "postgres",
    password: "Wagkanamakulit@02",
    port: 5432,
    debug: true,
    delayMs: 3000,

})

module.exports.insertCompany = async (event, context, callback) => {
    const {company_name, company_email} = JSON.parse(event.body)

    await client.connect()
    try {
        const result = await client.query(`INSERT INTO companies (company_name, company_email) VALUES ('${company_name}', '${company_email}')`)
        await client.clean
        return {
            statusCode: 200,
            body: JSON.stringify({ result: result })
        }
    } catch (error) {
        console.log(error)
        return{
            statusCode: 400,
            body: JSON.stringify({ message: error })
        }
    }
}

module.exports.getAllCompanies = async (event, context, callback) => {
    await client.connect()

    const {rows} = await client.query(`SELECT * FROM companies WHERE archived = false`)
    await client.clean()

    return{
        statusCode: 200,
        body: JSON.stringify( { result: rows })
    }
}

module.exports.getCompanyById = async (event, context, callback) =>{
    const {company_id} = event.pathParameters

    await client.connect()
    const result = await client.query(`SELECT * FROM companies WHERE id = ${company_id}`)
    await client.clean()
    return{
        statusCode: result.rows[0] ? 200: 404,
        body: JSON.stringify( {result: result.rows[0]} )
    }
}

module.exports.updateCompanyById = async(event, context, callback) => {
    const {company_id} = event.pathParameters
    const { company_name, company_email } = JSON.parse(event.body)

    await client.connect()
    const result = await client.query(`UPDATE companies SET company_name = '${company_name}', company_email = '${company_email}', modified_at = CURRENT_TIMESTAMP WHERE id = ${company_id}`)
    await client.clean()
    
    return{
        statusCode: 200,
        body: JSON.stringify({ result: result })
    }
}

module.exports.deleteCompanyById = async (event, context, callback) =>{
    const {company_id} = event.pathParameters

    await client.connect()
    const result = await client.query(`DELETE FROM companies WHERE id = ${company_id}`)
    await client.clean()

    return{
        statusCode: 200,
        body: JSON.stringify({ message: "Data has been successfully deleted" })
    }
}

module.exports.archiveCompanyById = async(event, context, callback) => {
    const {company_id} = event.pathParameters

    await client.connect()
    const result = await client.query(`UPDATE companies SET archived = true, modified_at = CURRENT_TIMESTAMP WHERE id = ${company_id}`)
    await client.clean()
    
    return{
        statusCode: 200,
        body: JSON.stringify({ result: result })
    }
}