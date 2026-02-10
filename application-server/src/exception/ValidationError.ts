import { HttpStatus } from '@nestjs/common';
import { AppError, type HttpErrorObject } from '@/exception/AppError';
import type { RequestSegment } from '@/types/http';
import type { ValidationIssue } from '@/types/validation';

export class ValidationError extends AppError {
	public readonly error: string = 'VALIDATION';
	public readonly segment: RequestSegment;
	public readonly issues: Array<ValidationIssue>;

	public constructor(segment: RequestSegment, issues: Array<ValidationIssue>) {
		super('Validation error');
		this.issues = issues;
		this.segment = segment;
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	public override getHttpStatus(): HttpStatus {
		return HttpStatus.BAD_REQUEST;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: this.getHttpStatus(),
			error: this.error,
			message: this.message,
			segment: this.segment,
			issues: this.issues,
		};
	}
}
