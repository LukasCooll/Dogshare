using DogShare.Thing;

namespace DogShare.Thing
{
    public class CommentLike
    {
        public string UserId { get; set; } = null!;
        public User User { get; set; } = null!;

        public int CommentId { get; set; }
        public Comment Comment { get; set; } = null!;
    }
}
