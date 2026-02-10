import type { $ZodIssue } from 'zod/v4/core';
import { objectPath } from '@/util/object';

export type ValidationIssueCode = $ZodIssue['code'];

export interface ValidationIssue {
	message: string;
	path: string | null;
	type: ValidationIssueCode;
}

export function validationIssueFromZodIssue(issue: $ZodIssue): ValidationIssue {
	return {
		message: issue.message,
		path: objectPath(issue.path),
		type: issue.code,
	};
}

export function invalidDataIssueFromZodIssue(issue: $ZodIssue): ValidationIssue {
	return {
		message: issue.message,
		path: objectPath(issue.path),
		type: issue.code,
	};
}
