using Microsoft.AspNetCore.Identity;

namespace DogShare.Thing
{
    public class Post
    {
        public int id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? Image { get; set; }
        public int Likes { get; set; }

        public required DateTime DatePosted { get; set; }

        public required string AuthorId { get; set; }
        public virtual User? Author { get; set; }

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
