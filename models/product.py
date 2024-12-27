class Product:
    def __init__(self, id, name, description, price, image_url, category):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.image_url = image_url
        self.category = category

    def to_dict(self):
        """Convert product object to dictionary for easy serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image_url': self.image_url,
            'category': self.category
        }

    @staticmethod
    def from_dict(data):
        """Create a Product instance from a dictionary"""
        return Product(
            id=data.get('id'),
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            image_url=data.get('image_url'),
            category=data.get('category')
        )

    def __str__(self):
        """String representation of the product"""
        return f"{self.name} (${self.price})"

# Example usage:
# product = Product(
#     id=1,
#     name="Kochi Special Tea",
#     description="Premium tea blend from Kerala",
#     price=9.99,
#     image_url="/static/images/kochi-tea.jpg",
#     category="Beverages"
# )
