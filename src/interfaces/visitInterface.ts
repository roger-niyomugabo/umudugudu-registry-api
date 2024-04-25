import { Model } from 'sequelize';

interface VisitInstance extends Model {
    id: string;
    origin: string;
    visitReason: string;
    duration: string;
    arrivalDate: string;
    file?: string;
}

export interface VisitResult {
    count: number;
    rows: VisitInstance[];
}
