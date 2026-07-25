using Microsoft.AspNetCore.Identity;

namespace DogShare.Thing
{
    public class Comment
    {
        public int id { get; set; }

        public required string CommentText { get; set; }

        public int Likes { get; set; }

        public int PostId { get; set; }
        public virtual Post? Post { get; set; }

        public required DateTime DateCommented { get; set; }

        public required string AuthorId { get; set; }
        public virtual User? Author { get; set; } = null;
    }
}
