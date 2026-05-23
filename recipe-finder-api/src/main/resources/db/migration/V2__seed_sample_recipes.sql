INSERT INTO recipes (id, name, image_url, description, category, time_label, ingredients, steps)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Phở Bò Hà Nội',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
    'Món phở truyền thống với nước dùng xương bò hầm nhiều giờ.',
    'Món nước',
    '4 giờ',
    '["500g bánh phở tươi","300g thịt bò tái","Hành lá, ngò gai"]'::jsonb,
    '["Chần xương bò qua nước sôi","Hầm xương 3-4 giờ","Trụng bánh phở và thưởng thức"]'::jsonb
),
(
    '22222222-2222-2222-2222-222222222222',
    'Cơm Tấm Sườn Bì Chả',
    'https://images.unsplash.com/photo-1766050587783-1c90751275dd?w=600&q=80',
    'Cơm tấm đặc trưng Sài Gòn với sườn nướng đậm đà.',
    'Cơm',
    '2 giờ',
    '["300g gạo tấm","4 miếng sườn heo","Nước mắm chua ngọt"]'::jsonb,
    '["Ướp sườn 1 tiếng","Nướng sườn 25 phút","Xếp cơm và thưởng thức"]'::jsonb
);
