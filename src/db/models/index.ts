import type { Sequelize } from 'sequelize';
import { User } from './user.model';
import { AdminUser } from './admin_user';
import { ChiefUser } from './chief_user';
import { ResidentUser } from './resident_user';
import { Village } from './village.model';
import { Visitor } from './visitor.model';
import { Visit } from './visit.model';

export {
    User,
    AdminUser,
    ResidentUser,
    ChiefUser,
    Village,
    Visitor,
    Visit
};

export function initModels(sequelize: Sequelize) {
    User.initModel(sequelize);
    AdminUser.initModel(sequelize);
    ResidentUser.initModel(sequelize);
    ChiefUser.initModel(sequelize);
    Village.initModel(sequelize);
    Visitor.initModel(sequelize);
    Visit.initModel(sequelize);

    // Model associations
    User.hasOne(AdminUser, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });
    AdminUser.belongsTo(User, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });

    User.hasOne(ResidentUser, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });
    ResidentUser.belongsTo(User, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });

    User.hasOne(ChiefUser, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });
    ChiefUser.belongsTo(User, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });

    Village.hasMany(ChiefUser, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });
    ChiefUser.belongsTo(Village, {
        foreignKey: {
            allowNull: false,
        },
    });

    Village.hasMany(ResidentUser, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });
    ResidentUser.belongsTo(Village, {
        foreignKey: {
            allowNull: false,
        },
    });

    User.hasMany(Visit, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });
    Visit.belongsTo(User, {
        foreignKey: {
            allowNull: false,
        },
    });

    Visitor.hasMany(Visit, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });
    Visit.belongsTo(Visitor, {
        foreignKey: {
            allowNull: false,
        },
    });

    Village.hasMany(Visit, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
    });
    Visit.belongsTo(Village, {
        foreignKey: {
            allowNull: false,
        },
    });

    return {
        User,
        AdminUser,
        ResidentUser,
        ChiefUser,
        Village,
        Visitor,
        Visit,
    };
}
