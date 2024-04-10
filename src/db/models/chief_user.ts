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
import { buildOrderSequelizeFilters, buildSelectionSequelizeFilters, buildWhereSequelizeFilters } from '../../utils';
import { User } from './user.model';
import { Village } from './village.model';

export class ChiefUser extends Model<
InferAttributes<ChiefUser>,
InferCreationAttributes<ChiefUser>
> {
    declare id: CreationOptional<string>;
    declare userId: ForeignKey<User['id']>;
    declare villageId: ForeignKey<Village['id']>;
    declare username: string;
    declare dateOfBirth: string;
    declare nationality: string;
    declare profession: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // ChiefUser belongsTo User
    declare user?: NonAttribute<User>;
    declare getUser: HasManyGetAssociationsMixin<User>;
    declare setUser: HasManySetAssociationsMixin<User, number>;
    declare createUser: HasManyCreateAssociationMixin<User>;

    // ChiefUser belongsTo Village
    declare village?: NonAttribute<Village>;
    declare getVillage: HasManyGetAssociationsMixin<Village>;
    declare setVillage: HasManySetAssociationsMixin<Village, number>;
    declare createVillage: HasManyCreateAssociationMixin<Village>;

    declare static associations: {
        User: Association<ChiefUser, User>;
        Village: Association<ChiefUser, Village>;
    };

    static initModel(sequelize: Sequelize): typeof ChiefUser {
        ChiefUser.init({
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                unique: true,
                autoIncrement: false,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
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
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        }, {
            modelName: 'chief_user',
            sequelize,
        });

        return ChiefUser;
    }

    static selectionAllowedFields: string[] = ['id', 'username', 'dateOfBirth', 'nationality', 'profession', 'createdAt', 'updatedAt'];
    static defaultSortFields: OrderClause[] = [
        ['username', 'asc'], ['createdAt', 'desc'],
    ];
    static sortAllowedFields: string[] = ['username', 'dateOfBirth', 'nationality', 'createdAt', 'updatedAt'];
    static queryAllowedFields: { [field: string]: { type: QueryParameterType } } = {
        id: { type: 'string' },
        username: { type: 'string' },
        dateOfBirth: { type: 'string' },
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
