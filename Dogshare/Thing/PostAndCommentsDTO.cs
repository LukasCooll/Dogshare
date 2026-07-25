namespace Dogshare.Thing
{
    public class PostDTO
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? Image { get; set; }
        public int Likes { get; set; }
        public required DateTime DatePosted { get; set; }
    }

    public class CommentDTO
    {
        public required string Content { get; set; }
        public required DateTime DatePosted { get; set; }
    }
}
