//book model
'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
        Book.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please enter a title for this book.'
                    }
                }
            },
            author: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please enter an author for this book.'
                    }
                }
            },
            genre: {
                type: Sequelize.STRING
            },
            year: {
                type: Sequelize.INTEGER
            }
        }, { sequelize });

    return Book;
};