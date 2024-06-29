"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@radix-ui/react-select";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { useMutationCreateInvitation } from "~/features/invitation/hooks/use-mutation-create-invitation";
import { Button } from "~/features/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "~/features/shared/components/ui/form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/features/shared/components/ui/select";
import { createInvitationInputSchema } from "../chat.schema";
import { useQueryChatInvitations } from "../hooks/use-query-chat-invitations";

type Props = {
  chatId: string;
};

function ChatInvitationForm({ chatId }: Props) {
  const {
    mutateAsync: createInvitation,
    isPending: isCreateInvitationPending,
  } = useMutationCreateInvitation();
  const { refetch: refetchChatInvitations } = useQueryChatInvitations({
    chatId,
  });

  const form = useForm<z.infer<typeof createInvitationInputSchema>>({
    resolver: zodResolver(createInvitationInputSchema),
    defaultValues: {
      chatId: chatId,
      type: "time-limited",
    },
  });

  async function onSubmit(values: z.infer<typeof createInvitationInputSchema>) {
    try {
      await createInvitation(values);
      await refetchChatInvitations();
    } catch (err) {
      //handle error
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center gap-4"
      >
        <div>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="one-time">One time</SelectItem>
                      <SelectItem value="time-limited">
                        Time limited(3d)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={isCreateInvitationPending}
          type="submit"
          className="flex items-center"
        >
          {isCreateInvitationPending ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            "Create invitation"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default ChatInvitationForm;
