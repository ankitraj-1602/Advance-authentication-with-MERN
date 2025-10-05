const viewProduct = async (req, res) => {
    res.send('View Product')
}

const createProduct = async (req, res) => {
    res.send('Create Product')
}

module.exports = { viewProduct, createProduct };