/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { type TRPCClientErrorLike } from "@trpc/client";
import {
  type DefaultErrorData,
  type DefaultErrorShape,
} from "@trpc/server/unstable-core-do-not-import";
import { type typeToFlattenedError } from "zod";

type ErrorShape = {
  input: any;
  output: any;
  transformer: boolean;
  errorShape: DefaultErrorShape & {
    data: DefaultErrorData & {
      zodError: typeToFlattenedError<any> | null;
    };
  };
};

export function useTrpcError<T extends ErrorShape>(
  ...trpcErrors: (TRPCClientErrorLike<T> | null | undefined)[]
) {
  useEffect(() => {
    trpcErrors.forEach((trpcError) => {
      if (trpcError) {
        console.error(
          `ERROR STATUS ${trpcError.data?.httpStatus} | ${trpcError.data?.code} : ${trpcError.message}`,
        );
      }
    });
  }, [...trpcErrors]);

  const formattedErrors = useMemo(() => {
    return trpcErrors.reduce<null | string>((acc, trpcError) => {
      if (!trpcError) {
        return null;
      }
      return acc
        ? `${acc}\nAn Error has occurred : ${trpcError.message}`
        : `\nAn Error has occurred : ${trpcError.message}`;
    }, null);
  }, [...trpcErrors]);

  return { formattedErrors };
}
