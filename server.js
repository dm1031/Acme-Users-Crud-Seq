const Sequelize = require('sequelize');

const conn = new Sequelize(process.env.DATABASE_URL);

const Page = conn.define('page', {
    name: Sequelize.STRING,
    isHomePage: Sequelize.BOOLEAN
});

const User = conn.define('user', {
    name: Sequelize.STRING,
    number: Sequelize.INTEGER
})

User.belongsTo(Page);
Page.hasMany(User);

const syncAndSeed = () => {
    return conn.sync({force: true})
    .then( async() => {
        const [home] = await Promise.all([
            Page.create({name: 'Home', isHomePage: true})
        ])
    })
};

module.exports = {
    Page,
    User,
    syncAndSeed
}