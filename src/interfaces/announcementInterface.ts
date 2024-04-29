import { Announcement } from '../db/models';

export interface AnnouncementResult {
    count: number;
    rows: Announcement[];
}
