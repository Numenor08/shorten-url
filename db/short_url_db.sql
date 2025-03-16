PGDMP  /    6                }            short_url_db    17.3    17.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                        1262    29335    short_url_db    DATABASE     r   CREATE DATABASE short_url_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE short_url_db;
                     postgres    false                        3079    29355 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            !           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �            1259    29396    session    TABLE     �   CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);
    DROP TABLE public.session;
       public         heap r       postgres    false            �            1259    29337    urls    TABLE     �   CREATE TABLE public.urls (
    id bigint NOT NULL,
    original_url text NOT NULL,
    short_url character varying(255) NOT NULL,
    clicks bigint DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.urls;
       public         heap r       postgres    false            "           0    0 
   TABLE urls    ACL     *   GRANT ALL ON TABLE public.urls TO athaya;
          public               postgres    false    231            �            1259    29336    urls_id_seq    SEQUENCE     �   CREATE SEQUENCE public.urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.urls_id_seq;
       public               postgres    false    231            #           0    0    urls_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.urls_id_seq OWNED BY public.urls.id;
          public               postgres    false    230            �            1259    29366    users    TABLE     �   CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    google_id character varying(255),
    name character varying(255) NOT NULL,
    password character varying(255),
    email character varying(255) NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false    2            v           2604    29422    urls id    DEFAULT     b   ALTER TABLE ONLY public.urls ALTER COLUMN id SET DEFAULT nextval('public.urls_id_seq'::regclass);
 6   ALTER TABLE public.urls ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    230    231                      0    29396    session 
   TABLE DATA           4   COPY public.session (sid, sess, expire) FROM stdin;
    public               postgres    false    233   �                 0    29337    urls 
   TABLE DATA           O   COPY public.urls (id, original_url, short_url, clicks, created_at) FROM stdin;
    public               postgres    false    231   �                 0    29366    users 
   TABLE DATA           E   COPY public.users (id, google_id, name, password, email) FROM stdin;
    public               postgres    false    232   �       $           0    0    urls_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.urls_id_seq', 7, true);
          public               postgres    false    230            �           2606    29402    session session_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
 >   ALTER TABLE ONLY public.session DROP CONSTRAINT session_pkey;
       public                 postgres    false    233                       2606    29377    users unique_email 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_email;
       public                 postgres    false    232            �           2606    29375    users unique_google_id 
   CONSTRAINT     V   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_google_id UNIQUE (google_id);
 @   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_google_id;
       public                 postgres    false    232            {           2606    29441    urls unique_short_url 
   CONSTRAINT     U   ALTER TABLE ONLY public.urls
    ADD CONSTRAINT unique_short_url UNIQUE (short_url);
 ?   ALTER TABLE ONLY public.urls DROP CONSTRAINT unique_short_url;
       public                 postgres    false    231            }           2606    29424    urls urls_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.urls DROP CONSTRAINT urls_pkey;
       public                 postgres    false    231            �           2606    29373    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    232                 x���OS�0���S89�ߒ��x���t��e���4�(��N�x�������-����!�/�Ć���=���<�e�V�3*�;T��9_m��Թ9�mc�RA�"8���i���pL�k�4e��QF�+�ʣ�k���.�v��_H��5aܢ�:w]�|�~=v�cNT�7�4�������iY����F���?�Z�X q,g�y��W���>kԡ��-�3���f�/��j�5�#%����(eS�$�\�$#,�
&� ~��,y%Irz��         �   x�}�An� ��p�^ ��	�H���@7�A�8˃嶧o�ETe��,���hj��ISֳ��$��)��A���s�g_����4j��pվ����Y+,fڶm"�ӕvp���c��k^��I%��a{�j��
��5p	�D"I����d��!�(a�8��{��3V`۱��Oa�~�c�O�E��hԑ}
��/�tX         �   x�M�=O�0 g�Wd���=�q�������"���q�T�V$2�_O��x�݁q����� �®�NJ͵�^9Imk4;5l�}���W�����Rd�pB���}Q�v�~������Ṝ.��R���t~\�M}�w��z����gF7!
��#_�Oc�+��4�!T��w�Vx��:�HbP�4� ƚ�R($ۧ���4��۽\����TfY��TF�     