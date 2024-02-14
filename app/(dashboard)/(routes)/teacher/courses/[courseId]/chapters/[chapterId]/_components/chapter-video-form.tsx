"use client"
import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, MuxData } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";



interface ChapterVideoProps {
    initialData: Chapter & {muxData:MuxData | null};
    courseId: string;
    chapterId:string;
};



const formSchema = z.object({
    videoUrl: z.string().min(1),
});





export const ChapterVideo = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoProps) => {

    const [isEdition, setIsEdition] = useState(false);

    const toggleEdit = () => setIsEdition((current) => !current);

    const router = useRouter();

    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         imageUrl: initialData?.imageUrl || "",
    //     }
    // });

    // const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated")
            router.refresh();
        } catch (error) {
            toast.error("something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">

                Chapter video
                <Button onClick={toggleEdit} variant={"ghost"}>
                  {isEdition && (
                    <>Cancel</>
                  )}
                  {
                    !isEdition && !initialData.videoUrl && (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add an video
                        </>
                    )
                  }
                  {!isEdition && initialData.videoUrl &&(
                    <>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Edit video
                    </>
                  )}

                </Button>
            </div>
            {!isEdition && 
            (!initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500 "/>

                        </div>
                ):(
                    <div className="relative aspect-video mt-2 ">
                       
                        <MuxPlayer 
                        playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
            )}
            {isEdition && (
              <div>
                <FileUpload
                endpoint="chapterVideo"
                onChange={(url)=>{
                    if(url){
                        onSubmit({videoUrl:url});

                    }
                }}
                />

                <div className=" text-xs text-muted-foreground  mt-4">

                    Upload this chapter&apos; video

                    </div>



              </div>
            )}
            {initialData.videoUrl && !isEdition && (
                <div className=" text-xs text-muted-foreground mt-2">
                    Video can take a few minutes to process. Refresh the page if video does not appear.
                </div>    
            )

            }
        </div>
    )
}