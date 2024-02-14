"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";



interface TiltleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});





export const TiltleForm = ({
    initialData,
    courseId
}: TiltleFormProps) => {

    const [isEdition, setIsEdition] = useState(false);

    const toggleEdit = () => setIsEdition((current) => !current);

    const router=useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.patch(`/api/courses/${courseId}`,values);
        toast.success("Course updated")
        toggleEdit();
        router.refresh();
      } catch (error) {
        toast.error("something went wrong");
      }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">

                Course title
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEdition ?
                        (<>Cancel</>) : (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit title
                            </>
                        )}

                </Button>
            </div>
            {!isEdition && (<p className="text-sm mt-2">
                {initialData.title}
            </p>)}
            {isEdition && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input disabled={isSubmitting}
                                        placeholder="e.g ` Advanced we development`"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>

                                </FormItem>
            )}

                        />

                        <div className=" flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting}
                            type ="submit">
                                save

                            </Button>

                        </div>


                    </form>
                </Form>
            )}
        </div>
    )
}