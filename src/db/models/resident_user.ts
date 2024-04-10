/* eslint-disable @typescript-eslint/member-ordering */
import {
    Association,
    CreationOptional,
    DataTypes,
    ForeignKey,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize } from 'sequelize';
import { OrderClause, QueryParameterType, WhereAutoClause } from 'interfaces/sequelize_query_builder';
import { maritalStatusT } from 'interfaces/userInterface';
import { buildOrderSequelizeFilters, buildSelectionSequelizeFilters, buildWhereSequelizeFilters } from '../../utils';
import { User } from './user.model';
import { Village } from './village.model';

export class ResidentUser extends Model<
InferAttributes<ResidentUser>,
InferCreationAttributes<ResidentUser>
> {
    declare id: CreationOptional<string>;
    declare userId: ForeignKey<User['id']>;
    declare villageId: ForeignKey<Village['id']>;
    declare dateOfBirth: string;
    declare nationality: string;
    declare profession: string;
    declare maritalStatus: maritalStatusT;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // ResidentUser belongsTo User
    declare user?: NonAttribute<User>;
    declare getUser: HasManyGetAssociationsMixin<User>;
    declare setUser: HasManySetAssociationsMixin<User, number>;
    declare createUser: HasManyCreateAssociationMixin<User>;

    // ResidentUser belongsTo Village
    declare village?: NonAttribute<Village>;
    declare getVillage: HasManyGetAssociationsMixin<Village>;
    declare setVillage: HasManySetAssociationsMixin<Village, number>;
    declare createVillage: HasManyCreateAssociationMixin<Village>;

    declare static associations: {
        User: Association<ResidentUser, User>;
        Village: Association<ResidentUser, Village>;
    };

    static initModel(sequelize: Sequelize): typeof ResidentUser {
        ResidentUser.init({
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                unique: true,
                autoIncrement: false,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            dateOfBirth: {
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
            maritalStatus: {
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
            modelName: 'resident_user',
            sequelize,
        });

        return ResidentUser;
    }

    static selectionAllowedFields: string[] = ['id', 'dateOfBirth', 'nationality', 'profession', 'maritalStatus', 'createdAt', 'updatedAt'];
    static defaultSortFields: OrderClause[] = [
        ['nationality', 'asc'], ['createdAt', 'desc'],
    ];
    static sortAllowedFields: string[] = ['dateOfBirth', 'nationality', 'profession', 'maritalStatus', 'createdAt', 'updatedAt'];
    static queryAllowedFields: { [field: string]: { type: QueryParameterType } } = {
        id: { type: 'string' },
        dateOfBirth: { type: 'string' },
        nationality: { type: 'string' },
        profession: { type: 'string' },
        maritalStatus: { type: 'string' },
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
