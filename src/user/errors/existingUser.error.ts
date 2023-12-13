import { HttpException, HttpStatus } from '@nestjs/common';

export class existingUserError extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message,
      },
      HttpStatus.CONFLICT,
    );
  }
}
