using DogShare.Thing;
using Microsoft.AspNetCore.Identity;

namespace DogShare.Thing
{
    public class PostLike
    {
        public string UserId { get; set; } = null!;
        public User User { get; set; } = null!;

        public int PostId { get; set; }
        public Post Post { get; set; } = null!;
    }
}
