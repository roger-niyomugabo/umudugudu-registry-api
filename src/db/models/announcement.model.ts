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
import { User } from './user.model';

export class Announcement extends Model<
InferAttributes<Announcement>,
InferCreationAttributes<Announcement>
> {
    declare id: CreationOptional<string>;
    declare userId: ForeignKey<User['id']>;
    declare villageId: ForeignKey<Village['id']>;
    declare title: string;
    declare description: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // Announcement belongs to chiefUser
    declare user?: NonAttribute<User>;
    declare getUser: HasManyGetAssociationsMixin<User>;
    declare setUser: HasManySetAssociationsMixin<User, number>;
    declare createUser: HasManyCreateAssociationMixin<User>;

    // Announcement belongs to village
    declare village?: NonAttribute<Village>;
    declare getVillage: HasManyGetAssociationsMixin<Village>;
    declare setVillage: HasManySetAssociationsMixin<Village, number>;
    declare createVillage: HasManyCreateAssociationMixin<Village>;

    declare static associations: {
        ResidentUser: Association<Announcement, User>;
        Village: Association<Announcement, Village>;
    };

    static initModel(sequelize: Sequelize): typeof Announcement {
        Announcement.init({
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                unique: true,
                autoIncrement: false,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
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
            modelName: 'announcement',
            sequelize,
        });

        return Announcement;
    }

    static selectionAllowedFields: string[] =
        ['id', 'title', 'description', 'createdAt', 'updatedAt'];
    static defaultSortFields: OrderClause[] = [
        ['title', 'asc'], ['createdAt', 'desc'],
    ];
    static sortAllowedFields: string[] = ['title', 'createdAt', 'updatedAt'];
    static queryAllowedFields: { [field: string]: { type: QueryParameterType } } = {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
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
