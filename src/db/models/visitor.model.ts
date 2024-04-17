/* eslint-disable @typescript-eslint/member-ordering */
import {
    Association,
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize } from 'sequelize';
import { OrderClause, QueryParameterType, WhereAutoClause } from 'interfaces/sequelize_query_builder';
import { genderT } from 'interfaces/userInterface';
import { buildOrderSequelizeFilters, buildSelectionSequelizeFilters, buildWhereSequelizeFilters } from '../../utils';
import { Village } from './village.model';

export class Visitor extends Model<
InferAttributes<Visitor>,
InferCreationAttributes<Visitor>
> {
    declare id: CreationOptional<string>;
    declare fullName: string;
    declare NID: string;
    declare email: string;
    declare phoneNumber: string;
    declare gender: genderT;
    declare nationality: string;
    declare profession: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare static associations: {
        Village: Association<Visitor, Village>;
    };

    static initModel(sequelize: Sequelize): typeof Visitor {
        Visitor.init({
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                unique: true,
                autoIncrement: false,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            fullName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            NID: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            profession: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        }, {
            modelName: 'visitor',
            sequelize,
        });

        return Visitor;
    }

    static selectionAllowedFields: string[] = ['id', 'fullName', 'NID', 'email', 'phoneNumber', 'gender', 'nationality', 'profession', 'createdAt', 'updatedAt'];
    static defaultSortFields: OrderClause[] = [
        ['fullName', 'asc'], ['createdAt', 'desc'],
    ];
    static sortAllowedFields: string[] = ['fullName', 'email', 'gender', 'nationality', 'profession', 'createdAt', 'updatedAt'];
    static queryAllowedFields: { [field: string]: { type: QueryParameterType } } = {
        id: { type: 'string' },
        fullName: { type: 'string' },
        NID: { type: 'string' },
        email: { type: 'string' },
        phoneNumber: { type: 'string' },
        gender: { type: 'string' },
        nationality: { type: 'string' },
        profession: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static getOrderQuery(query: any): OrderClause[] {
        return buildOrderSequelizeFilters(query, this.defaultSortFields, this.sortAllowedFields);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static getSelectionQuery(query: any): string[] {
        return buildSelectionSequelizeFilters(query, this.selectionAllowedFields);
    }

    /**
     * Be careful when using this function. It may return one Op.and and one Op.or
     * You have to make sure the combination of your normal where query and the result
     * that could come here can be coupled correctly
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static getWhereQuery(query: any): WhereAutoClause {
        return buildWhereSequelizeFilters(query, this.queryAllowedFields);
    }
}
