import fs from 'fs';
import { z } from 'zod';
import { Request } from 'express';

import { APIError } from '@/lib/error';
import { IResponse } from '@/lib/request';

type Response = IResponse<{
  content: string;
}>;

/**
 * Endpoint:     GET /api/v1/content/[id]
 * Description:  Get a courses markdown content from the content folder
 */
export default async (req: Request): Promise<Response> => {
  const schema = z.object({
    id: z.string().regex(/^[a-zA-Z0-9-]+\.md$/, {
      message:
        "String must end with '.md' and cannot contain special characters",
    }),
  });

  const params = schema.safeParse(req.params);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const { id } = params.data;

  const projectRoot = process.cwd();
  const contentPath = `${projectRoot}/content/${id}`;

  // Get all files in the content folder server-side, and then ensure
  // that the requested file is in the list of whitelisted files
  const whitelistedContent = fs.readdirSync(`${process.cwd()}/content`);

  if (!whitelistedContent.includes(id)) {
    throw new APIError({
      type: 'NOT_FOUND',
      traceback: 2,
      humanMessage: `Content file ${id} not found`,
    });
  }

  if (!fs.existsSync(contentPath)) {
    throw new APIError({
      type: 'NOT_FOUND',
      traceback: 2,
      humanMessage: `Content file ${id} not found`,
    });
  }

  const content = fs.readFileSync(contentPath, 'utf8');

  const response: Response = {
    data: {
      content,
    },
  };

  return response;
};
