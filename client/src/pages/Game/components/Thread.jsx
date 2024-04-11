import {

    useThreads,
    useSelf,
    useOthers,
    useEditComment,
  } from "../game_liveblocks.config";

  import { Composer, Thread } from "@liveblocks/react-comments";
export default function ThreadContainer() {
    const currentUser = useSelf();
    const others = useOthers();
  
    const { threads } = useThreads();
    const editComment = useEditComment();
    
  
    const getComments = async ({ thread }) => {
      thread.comments.slice(0, 5).map((comment)=>{
      // thread.comments.map((comment) => {


        if (comment.body?.content[0].children[0].text == "hello") {
            editComment({
                threadId: thread.id,
                commentId: comment.id,
                body:{
                    version:1,
                    content: [
                    {
                    type: "paragraph",
                    children: [
                        {
                        text: "CORRECTED ANSWER",
                        },
                    ],
                    },
                ],
            }
                
            });

        }
      });
    };
  
    return (
      <div className =" absolute top-[70px] left-[850px] w-[360px]  ">
        {/* <div className =" mt-2 mr-2 ml-2 border-[#EB87B6] border-4 h-[590px] rounded-[24px]" > */}
        {
        threads.map(
          (thread) => (
            getComments({ thread}),
            (<Thread key={thread.id} thread={thread} className="thread" />)
          )
        )}
        {threads.length == 0 ? <Composer className="composer" /> : <></>}

      </div>
      
    );
  }