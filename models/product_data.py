from .product import Product

# Initial product catalog
products = [
    Product(id=1, name="Masala Chai", description="Traditional Indian spiced tea blend with cardamom, cinnamon, and ginger", price=8.99, image_url="masala_chai.jpg", category="Tea"),
    Product(id=2, name="Jasmine Green Tea", description="Fragrant green tea infused with delicate jasmine blossoms", price=7.49, image_url="jasmine_green_tea.jpg", category="Tea"),
    Product(id=3, name="Earl Grey", description="Classic black tea with a hint of bergamot citrus", price=6.99, image_url="earl_grey.jpg", category="Tea"),
    Product(id=4, name="Matcha Latte Mix", description="Premium Japanese matcha powder for a creamy latte experience", price=12.99, image_url="matcha_latte.jpg", category="Tea"),
    Product(id=5, name="Chamomile Herbal Tea", description="Relaxing caffeine-free blend of chamomile flowers", price=5.99, image_url="chamomile_tea.jpg", category="Tea"),
    Product(id=6, name="Spicy Hot Chocolate", description="Rich cocoa mix with a kick of cayenne pepper", price=10.49, image_url="spicy_hot_chocolate.jpg", category="Hot Beverages"),
    Product(id=7, name="Vanilla Rooibos", description="Naturally sweet, caffeine-free red tea with a touch of vanilla", price=7.99, image_url="vanilla_rooibos.jpg", category="Tea"),
    Product(id=8, name="Iced Lemon Green Tea", description="Refreshing green tea blend with zesty lemon flavor", price=4.99, image_url="iced_lemon_green_tea.jpg", category="Cold Beverages"),
    Product(id=9, name="Turmeric Ginger Tea", description="A warm and healing blend of turmeric and ginger", price=9.49, image_url="turmeric_ginger_tea.jpg", category="Tea"),
    Product(id=10, name="Peppermint Tea", description="Cool and invigorating caffeine-free peppermint leaves", price=6.49, image_url="peppermint_tea.jpg", category="Tea"),
    Product(id=11, name="Hibiscus Cooler", description="Tangy and vibrant iced hibiscus tea, perfect for summer", price=5.49, image_url="hibiscus_cooler.jpg", category="Cold Beverages"),
    Product(id=12, name="Choco Hazelnut Spread", description="Decadent chocolate spread with a nutty hazelnut twist", price=6.99, image_url="choco_hazelnut_spread.jpg", category="Condiments"),
    Product(id=13, name="Mango Peach Iced Tea", description="A tropical fusion of mango and peach flavors in iced tea", price=4.79, image_url="mango_peach_iced_tea.jpg", category="Cold Beverages"),
    Product(id=14, name="Honey Lavender Latte", description="Smooth coffee latte infused with honey and lavender essence", price=11.49, image_url="honey_lavender_latte.jpg", category="Hot Beverages"),
    Product(id=15, name="Oolong Tea", description="Smooth and aromatic tea with a balance between green and black tea", price=8.29, image_url="oolong_tea.jpg", category="Tea"),
    Product(id=16, name="Golden Milk Blend", description="A soothing mix of turmeric, cinnamon, and coconut milk powder", price=9.99, image_url="golden_milk_blend.jpg", category="Hot Beverages"),
    Product(id=17, name="Coconut Chai", description="Exotic chai tea blend with creamy coconut flakes", price=8.99, image_url="coconut_chai.jpg", category="Tea"),
    Product(id=18, name="Berry Hibiscus Tea", description="Fruity and refreshing herbal tea with a vibrant red hue", price=7.49, image_url="berry_hibiscus_tea.jpg", category="Tea"),
    Product(id=19, name="Caramel Macchiato Mix", description="Rich caramel flavor for creating creamy macchiatos at home", price=10.99, image_url="caramel_macchiato_mix.jpg", category="Hot Beverages"),
    Product(id=20, name="Lemongrass Ginger Tea", description="Zesty and revitalizing blend of lemongrass and ginger", price=6.99, image_url="lemongrass_ginger_tea.jpg", category="Tea"),
    Product(id=21, name="Raspberry Iced Tea", description="Sweet and tangy iced tea with real raspberry flavor", price=5.49, image_url="raspberry_iced_tea.jpg", category="Cold Beverages"),
    Product(id=22, name="French Vanilla Cappuccino", description="Creamy cappuccino mix with a touch of French vanilla", price=7.99, image_url="french_vanilla_cappuccino.jpg", category="Hot Beverages"),
    Product(id=23, name="Rose Petal Tea", description="Delicate floral tea made with handpicked rose petals", price=8.49, image_url="rose_petal_tea.jpg", category="Tea"),
    Product(id=24, name="Spiced Apple Cider", description="Warm cider mix infused with cinnamon and nutmeg", price=9.49, image_url="spiced_apple_cider.jpg", category="Hot Beverages"),
    Product(id=25, name="Mint Mojito Iced Tea", description="Refreshing iced tea with a burst of mint and lime flavors", price=5.79, image_url="mint_mojito_iced_tea.jpg", category="Cold Beverages"),
    Product(id=26, name="Dark Chocolate Bark", description="Rich dark chocolate with almonds and sea salt", price=6.49, image_url="dark_chocolate_bark.jpg", category="Snacks"),
    Product(id=27, name="Cranberry Almond Trail Mix", description="Nutritious snack with almonds, cranberries, and sunflower seeds", price=4.99, image_url="cranberry_almond_trail_mix.jpg", category="Snacks"),
    Product(id=28, name="Honey Lemon Tea", description="Sweet and tangy blend of honey and lemon-infused tea", price=7.29, image_url="honey_lemon_tea.jpg", category="Tea"),
    Product(id=29, name="White Peony Tea", description="Mild and delicate white tea with floral notes", price=12.99, image_url="white_peony_tea.jpg", category="Tea"),
    Product(id=30, name="Hazelnut Coffee Blend", description="Aromatic coffee blend with a nutty hazelnut twist", price=11.49, image_url="hazelnut_coffee_blend.jpg", category="Hot Beverages"),
    Product(id=31, name="Cinnamon Apple Tea", description="Comforting blend of apple pieces and warm cinnamon spice", price=6.99, image_url="cinnamon_apple_tea.jpg", category="Tea"),
    Product(id=32, name="Coconut Water Latte", description="Refreshing coconut water blended with creamy coffee", price=9.49, image_url="coconut_water_latte.jpg", category="Cold Beverages"),
    Product(id=33, name="Chocolate Matcha Energy Bites", description="Nutritious energy bites with matcha and dark chocolate", price=5.99, image_url="chocolate_matcha_energy_bites.jpg", category="Snacks"),
    Product(id=34, name="Moroccan Mint Tea", description="Refreshing green tea with a touch of Moroccan mint", price=7.79, image_url="moroccan_mint_tea.jpg", category="Tea"),
    Product(id=35, name="Caramel Pumpkin Spice Latte", description="Seasonal favorite with creamy caramel and pumpkin spice", price=10.99, image_url="caramel_pumpkin_spice_latte.jpg", category="Hot Beverages"),
    Product(id=36, name="Blueberry Iced Tea", description="Sweet and tangy iced tea with a burst of blueberry flavor", price=5.49, image_url="blueberry_iced_tea.jpg", category="Cold Beverages"),
    Product(id=37, name="Ginger Lemon Honey Tea", description="Healing blend of ginger, lemon, and honey for a soothing drink", price=7.99, image_url="ginger_lemon_honey_tea.jpg", category="Tea"),
    Product(id=38, name="Almond Biscotti", description="Crunchy Italian-style cookies with roasted almond pieces", price=4.99, image_url="almond_biscotti.jpg", category="Snacks"),
    Product(id=39, name="Vanilla Bean Coffee Syrup", description="Gourmet syrup for adding a touch of vanilla to your coffee", price=6.49, image_url="vanilla_bean_coffee_syrup.jpg", category="Condiments"),
    Product(id=40, name="Tropical Mango Smoothie Mix", description="Delicious mix for blending refreshing mango smoothies", price=9.79, image_url="tropical_mango_smoothie_mix.jpg", category="Cold Beverages"),
    Product(id=41, name="Lavender Honey Cookies", description="Soft cookies infused with lavender and sweet honey", price=5.99, image_url="lavender_honey_cookies.jpg", category="Snacks"),
    Product(id=42, name="Oolong Peach Tea", description="Smooth oolong tea with a hint of juicy peach flavor", price=8.29, image_url="oolong_peach_tea.jpg", category="Tea"),
    Product(id=43, name="Dark Roast Espresso Beans", description="Rich and bold espresso beans for the perfect coffee shot", price=12.49, image_url="dark_roast_espresso_beans.jpg", category="Hot Beverages"),
    Product(id=44, name="Honey Citrus Tea", description="Bright and zesty tea blend with a drizzle of honey sweetness", price=7.29, image_url="honey_citrus_tea.jpg", category="Tea"),
    Product(id=45, name="Iced Green Tea Lemonade", description="Refreshing blend of green tea and tart lemonade", price=4.99, image_url="iced_green_tea_lemonade.jpg", category="Cold Beverages"),
    Product(id=46, name="Chai Spiced Biscotti", description="Crispy biscotti infused with warm chai spices", price=4.79, image_url="chai_spiced_biscotti.jpg", category="Snacks"),
    Product(id=47, name="Lime Mint Cooler", description="Refreshing lime and mint-infused iced beverage", price=5.99, image_url="lime_mint_cooler.jpg", category="Cold Beverages"),
    Product(id=48, name="Toasted Coconut Latte", description="Creamy latte with a hint of toasted coconut sweetness", price=10.49, image_url="toasted_coconut_latte.jpg", category="Hot Beverages"),
    Product(id=49, name="Peach Hibiscus Iced Tea", description="Sweet hibiscus tea with a burst of peach flavor", price=5.49, image_url="peach_hibiscus_iced_tea.jpg", category="Cold Beverages"),
    Product(id=50, name="Triple Berry Energy Mix", description="A blend of berries, nuts, and seeds for a quick energy boost", price=6.99, image_url="triple_berry_energy_mix.jpg", category="Snacks"),
    Product(id=51, name="Golden Chai Latte", description="Warm and spiced latte with turmeric and chai flavors", price=10.99, image_url="golden_chai_latte.jpg", category="Hot Beverages"),
    Product(id=52, name="Tropical Passionfruit Tea", description="Exotic tea blend with tropical passionfruit and floral notes", price=8.29, image_url="tropical_passionfruit_tea.jpg", category="Tea"),
    Product(id=53, name="Raspberry Mint Lemonade", description="Cool lemonade with fresh raspberries and a hint of mint", price=5.79, image_url="raspberry_mint_lemonade.jpg", category="Cold Beverages"),
    Product(id=54, name="Hazelnut Truffle Coffee", description="Decadent coffee blend with a rich hazelnut truffle flavor", price=12.99, image_url="hazelnut_truffle_coffee.jpg", category="Hot Beverages"),
    Product(id=55, name="Carrot Cake Energy Bites", description="Delicious bites with carrots, walnuts, and a hint of cinnamon", price=6.49, image_url="carrot_cake_energy_bites.jpg", category="Snacks"),
    Product(id=56, name="Spicy Mango Chutney", description="Tangy and spicy chutney made with fresh mangoes and chili", price=4.99, image_url="spicy_mango_chutney.jpg", category="Condiments"),
    Product(id=57, name="Wildberry Rooibos Tea", description="Caffeine-free rooibos tea with a blend of wildberries", price=7.79, image_url="wildberry_rooibos_tea.jpg", category="Tea"),
    Product(id=58, name="Cinnamon Dolce Latte", description="Rich latte with sweet cinnamon dolce syrup", price=11.29, image_url="cinnamon_dolce_latte.jpg", category="Hot Beverages"),
    Product(id=59, name="Pineapple Coconut Iced Tea", description="Refreshing iced tea with tropical pineapple and coconut flavors", price=5.99, image_url="pineapple_coconut_iced_tea.jpg", category="Cold Beverages"),
    Product(id=60, name="Matcha Chocolate Bark", description="Premium white chocolate infused with matcha green tea", price=8.99, image_url="matcha_chocolate_bark.jpg", category="Snacks"),
    Product(id=61, name="Elderflower Sparkling Tea", description="Elegant sparkling tea with the floral notes of elderflower", price=9.49, image_url="elderflower_sparkling_tea.jpg", category="Cold Beverages"),
    Product(id=62, name="Peach Vanilla Herbal Tea", description="Sweet herbal tea with notes of peach and vanilla", price=7.29, image_url="peach_vanilla_herbal_tea.jpg", category="Tea"),
    Product(id=63, name="Mexican Hot Chocolate", description="Rich hot chocolate with a spicy cinnamon kick", price=9.99, image_url="mexican_hot_chocolate.jpg", category="Hot Beverages"),
    Product(id=64, name="Dark Chocolate Almond Spread", description="Smooth chocolate spread with crunchy almond bits", price=7.99, image_url="dark_chocolate_almond_spread.jpg", category="Condiments"),
    Product(id=65, name="Chai Latte Concentrate", description="Pre-mixed chai concentrate for the perfect latte at home", price=8.49, image_url="chai_latte_concentrate.jpg", category="Tea"),
    Product(id=66, name="Lemon Ginger Energy Bites", description="Zesty energy bites with a kick of lemon and ginger", price=5.99, image_url="lemon_ginger_energy_bites.jpg", category="Snacks"),
    Product(id=67, name="Coconut Matcha Iced Latte", description="Cool and creamy iced latte with matcha and coconut milk", price=10.79, image_url="coconut_matcha_iced_latte.jpg", category="Cold Beverages"),
    Product(id=68, name="Cranberry Apple Tea", description="Warm and fruity tea blend with cranberries and apple pieces", price=7.49, image_url="cranberry_apple_tea.jpg", category="Tea"),
    Product(id=69, name="Maple Pecan Granola", description="Crunchy granola with the sweet taste of maple and roasted pecans", price=6.99, image_url="maple_pecan_granola.jpg", category="Snacks"),
    Product(id=70, name="Lemongrass Lime Iced Tea", description="Zesty iced tea with fresh lemongrass and lime flavors", price=5.49, image_url="lemongrass_lime_iced_tea.jpg", category="Cold Beverages"),
]


def get_all_products():
    """Return all products"""
    return products

def get_product_by_id(id):
    """Find a product by its ID"""
    return next((product for product in products if product.id == id), None)

def get_products_by_category(category):
    """Get all products in a specific category"""
    return [product for product in products if product.category == category]
