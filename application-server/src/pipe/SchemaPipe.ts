import { ArgumentMetadata, Injectable, Optional, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';
import { requestSegmentFromParamType } from '@/types/http';
import { ValidationError } from '@/exception/ValidationError';
import { validationIssueFromZodIssue } from '@/types/validation';

@Injectable()
export class SchemaPipe<T> implements PipeTransform {
	public constructor(
		@Optional()
		private readonly schema: ZodType<T>
	) {}

	public async transform(value: unknown, metadata: ArgumentMetadata): Promise<T> {
		const result = await this.schema.safeParseAsync(value);
		if (!result.success) {
			throw new ValidationError(
				requestSegmentFromParamType(metadata.type),
				result.error.issues.map(issue => validationIssueFromZodIssue(issue))
			);
		}

		return result.data;
	}
}
