/* eslint-disable @typescript-eslint/member-ordering */
import {
    Association,
    CreationOptional,
    DataTypes,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize } from 'sequelize';
import { OrderClause, QueryParameterType, WhereAutoClause } from 'interfaces/sequelize_query_builder';
import { buildOrderSequelizeFilters, buildSelectionSequelizeFilters, buildWhereSequelizeFilters } from '../../utils';
import { ChiefUser } from './chief_user';
import { ResidentUser } from './resident_user';

export class Village extends Model<
InferAttributes<Village>,
InferCreationAttributes<Village>
> {
    declare id: CreationOptional<string>;
    declare province: string;
    declare district: string;
    declare sector: string;
    declare cell: string;
    declare village: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // Village hasMany ChiefUser
    declare chief_user?: NonAttribute<ChiefUser>;
    declare getChiefUser: HasManyGetAssociationsMixin<ChiefUser>;
    declare setChiefUser: HasManySetAssociationsMixin<ChiefUser, number>;
    declare createChiefUser: HasManyCreateAssociationMixin<ChiefUser>;

    // Village hasMany ResidentUser
    declare resident_user?: NonAttribute<ResidentUser>;
    declare getResidentUser: HasManyGetAssociationsMixin<ResidentUser>;
    declare setResidentUser: HasManySetAssociationsMixin<ResidentUser, number>;
    declare createResidentUser: HasManyCreateAssociationMixin<ResidentUser>;

    declare static associations: {
        ChiefUser: Association<Village, ChiefUser>;
        ResidentUser: Association<Village, ResidentUser>;
    };
    static initModel(sequelize: Sequelize): typeof Village {
        Village.init({
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                unique: true,
                autoIncrement: false,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            province: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            district: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sector: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            cell: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            village: {
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
            modelName: 'village',
            sequelize,
        });

        return Village;
    }

    static selectionAllowedFields: string[] =
        ['id', 'province', 'district', 'sector', 'cell', 'village', 'createdAt', 'updatedAt'];
    static defaultSortFields: OrderClause[] = [
        ['village', 'asc'],
    ];
    static sortAllowedFields: string[] = ['province', 'district', 'sector', 'cell', 'village', 'createdAt', 'updatedAt'];
    static queryAllowedFields: { [field: string]: { type: QueryParameterType } } = {
        id: { type: 'string' },
        province: { type: 'string' },
        district: { type: 'string' },
        sector: { type: 'string' },
        cell: { type: 'string' },
        village: { type: 'string' },
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
