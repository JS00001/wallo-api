/*
 * Created on Sun Aug 20 2023
 *
 * This software is the proprietary property of CampusRush.
 * All rights reserved. Unauthorized copying, modification, or distribution
 * of this software, in whole or in part, is strictly prohibited.
 * For licensing information contact CampusRush.
 *
 * Copyright (c) 2023 CampusRush
 * Do not distribute
 */

import { IUserSchema } from '@/models/@types';

declare global {
  declare namespace Express {
    export interface Request {
      user?: IUserSchema;
    }
  }
}
