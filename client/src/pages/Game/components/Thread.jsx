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
        
      thread.comments.map((comment) => {
        console.log(comment);

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
      <div className ="" >
        {threads.map(
          (thread) => (
            getComments({ thread}),
            (<Thread key={thread.id} thread={thread} className="thread" />)
          )
        )}
        {threads.length == 0 ? <Composer className="composer" /> : <></>}
      </div>
    );
  }