PGDMP      2                }            short_url_db    17.3    17.3     "           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            #           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            $           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            %           1262    29335    short_url_db    DATABASE     r   CREATE DATABASE short_url_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE short_url_db;
                     postgres    false            &           0    0    DATABASE short_url_db    ACL     .   GRANT ALL ON DATABASE short_url_db TO athaya;
                        postgres    false    4901                        3079    29355 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            '           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �            1259    29396    session    TABLE     �   CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);
    DROP TABLE public.session;
       public         heap r       postgres    false            �            1259    29337    urls    TABLE     ;  CREATE TABLE public.urls (
    id bigint NOT NULL,
    original_url text NOT NULL,
    short_url character varying(255) NOT NULL,
    clicks bigint DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_user uuid NOT NULL,
    image_path character varying(255)
);
    DROP TABLE public.urls;
       public         heap r       postgres    false            (           0    0 
   TABLE urls    ACL     *   GRANT ALL ON TABLE public.urls TO athaya;
          public               postgres    false    235            �            1259    29336    urls_id_seq    SEQUENCE     �   CREATE SEQUENCE public.urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.urls_id_seq;
       public               postgres    false    235            )           0    0    urls_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.urls_id_seq OWNED BY public.urls.id;
          public               postgres    false    234            �            1259    29366    users    TABLE     �   CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    google_id character varying(255),
    name character varying(255) NOT NULL,
    password character varying(255),
    email character varying(255) NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false    2            z           2604    29422    urls id    DEFAULT     b   ALTER TABLE ONLY public.urls ALTER COLUMN id SET DEFAULT nextval('public.urls_id_seq'::regclass);
 6   ALTER TABLE public.urls ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    235    235                      0    29396    session 
   TABLE DATA           4   COPY public.session (sid, sess, expire) FROM stdin;
    public               postgres    false    237   C                 0    29337    urls 
   TABLE DATA           d   COPY public.urls (id, original_url, short_url, clicks, created_at, id_user, image_path) FROM stdin;
    public               postgres    false    235   �                 0    29366    users 
   TABLE DATA           E   COPY public.users (id, google_id, name, password, email) FROM stdin;
    public               postgres    false    236   �       *           0    0    urls_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.urls_id_seq', 10, true);
          public               postgres    false    234            �           2606    29402    session session_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
 >   ALTER TABLE ONLY public.session DROP CONSTRAINT session_pkey;
       public                 postgres    false    237            �           2606    29377    users unique_email 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_email;
       public                 postgres    false    236            �           2606    29375    users unique_google_id 
   CONSTRAINT     V   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_google_id UNIQUE (google_id);
 @   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_google_id;
       public                 postgres    false    236                       2606    29441    urls unique_short_url 
   CONSTRAINT     U   ALTER TABLE ONLY public.urls
    ADD CONSTRAINT unique_short_url UNIQUE (short_url);
 ?   ALTER TABLE ONLY public.urls DROP CONSTRAINT unique_short_url;
       public                 postgres    false    235            �           2606    29424    urls urls_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.urls DROP CONSTRAINT urls_pkey;
       public                 postgres    false    235            �           2606    29373    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    236            �           2606    29458    urls fk_urls_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.urls
    ADD CONSTRAINT fk_urls_user FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 ;   ALTER TABLE ONLY public.urls DROP CONSTRAINT fk_urls_user;
       public               postgres    false    235    4743    236               �  x���[o� ���ST<8�1o�e�W�I�L��I���Ԟ/˥�wy�4�i�4��H���	���m��9^���<����xSn��m]����W�C��mUVof}ov��W���F�횪u҈&0��D��Q�(A#Թlh��¬;7B˾o�o�=�};�sc��o�	O��k�?M:��:Q6�1��0�E�-��Rf�`�\It<^�pI�汦$H���ÕL�a���x���YS��>;���W�O��R���$���p,���s�\���FNn��U��b������d�����󕙰N�BbpN`�8�`W��2n�:����Z�� f�����NJ9�|�[�(^��M�er�RpM ��G��\و���Q�-�"�Y���R0�E���[�/E��         �   x���M� ��5���O(�:A'`���"����q������;�A����R�mIy����fw�Ezz�q�	 �	$�8b&17έdVH�M�XZe�����_.8H��� *H߶�Fy��{��8;���������.�v�yc�
k��Oe�	�e@��Lª�*Cj}�����]�TU��j\�         
  x�mϹr�@���~

�5���G��"&&�!i��`�P��g�J��/�O��$�;�0�Z���P�R��b�Dh  ����;"0X̆~��m�.V�b�3^�f���W��ԭG��I��NE�h� r�y=�6�F�:XD���φO<z�3��O޶�_��K���!/-d9E�uJ��6�����B��!w�����Կ����x����ô����b!r|x����ʼ?���q�|�w=����i�~,����sߪ*��
=h�     