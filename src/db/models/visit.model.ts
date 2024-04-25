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
import { Village } from './village.model';
import { Visitor } from './visitor.model';
import { ResidentUser } from './resident_user';

export class Visit extends Model<
InferAttributes<Visit>,
InferCreationAttributes<Visit>
> {
    declare id: CreationOptional<string>;
    declare residentUserId: ForeignKey<ResidentUser['id']>;
    declare visitorId: ForeignKey<Visitor['id']>;
    declare villageId: ForeignKey<Village['id']>;
    declare origin: string;
    declare visitReason: string;
    declare duration: string;
    declare arrivalDate: string;
    declare file?: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // Visit belongs to residentUser
    declare resident_user?: NonAttribute<ResidentUser>;
    declare getResidentUser: HasManyGetAssociationsMixin<ResidentUser>;
    declare setResidentUser: HasManySetAssociationsMixin<ResidentUser, number>;
    declare createResidentUser: HasManyCreateAssociationMixin<ResidentUser>;

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
        ResidentUser: Association<Visit, ResidentUser>;
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
            file: {
                type: DataTypes.STRING,
                allowNull: true,
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
        ['id', 'origin', 'visitReason', 'duration', 'arrivalDate', 'file', 'createdAt', 'updatedAt'];
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
