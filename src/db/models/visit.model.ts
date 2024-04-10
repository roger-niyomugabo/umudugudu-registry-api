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
import { Visitor } from './visitor.model';

export class Visit extends Model<
InferAttributes<Visit>,
InferCreationAttributes<Visit>
> {
    declare id: CreationOptional<string>;
    declare residentId: ForeignKey<User['id']>;
    declare visitorId: ForeignKey<Visitor['id']>;
    declare villageId: ForeignKey<Village['id']>;
    declare origin: string;
    declare visitReason: string;
    declare duration: string;
    declare arrivalDate: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // Visit belongs to residentUser or helperUser
    declare user?: NonAttribute<User>;
    declare getUser: HasManyGetAssociationsMixin<User>;
    declare setUser: HasManySetAssociationsMixin<User, number>;
    declare createUser: HasManyCreateAssociationMixin<User>;

    // Visit belongs to visitor
    declare visitor?: NonAttribute<Visitor>;
    declare getVisitor: HasManyGetAssociationsMixin<Visitor>;
    declare setVisitor: HasManySetAssociationsMixin<Visitor, number>;
    declare createVisitor: HasManyCreateAssociationMixin<Visitor>;

    // Visit belongs to village
    declare village?: NonAttribute<Village>;
    declare getVillage: HasManyGetAssociationsMixin<Village>;
    declare setVillage: HasManySetAssociationsMixin<Village, number>;
    declare createVillage: HasManyCreateAssociationMixin<Village>;

    declare static associations: {
        User: Association<Visit, User>;
        Visitor: Association<Visit, Visitor>;
        Village: Association<Visit, Village>;
    };

    static initModel(sequelize: Sequelize): typeof Visit {
        Visit.init({
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                unique: true,
                autoIncrement: false,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            origin: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            visitReason: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            duration: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            arrivalDate: {
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
            modelName: 'visit',
            sequelize,
        });

        return Visit;
    }

    static selectionAllowedFields: string[] =
        ['id', 'origin', 'visitReason', 'duration', 'arrivalDate', 'createdAt', 'updatedAt'];
    static defaultSortFields: OrderClause[] = [
        ['createdAt', 'desc'],
    ];
    static sortAllowedFields: string[] = ['createdAt', 'updatedAt'];
    static queryAllowedFields: { [field: string]: { type: QueryParameterType } } = {
        id: { type: 'string' },
        origin: { type: 'string' },
        visitReason: { type: 'string' },
        duration: { type: 'string' },
        arrivalDate: { type: 'string' },
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
