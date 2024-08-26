-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 26, 2024 at 10:35 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `task`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `mobile_number` int(15) NOT NULL,
  `avatarurl` text DEFAULT NULL,
  `age` int(5) NOT NULL,
  `password` text NOT NULL,
  `address` varchar(50) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `mobile_number`, `avatarurl`, `age`, `password`, `address`, `status`, `created`) VALUES
(2, 'Juned', 'Pathan', 'junedpathan291@gmail.com', 2147483647, 'http://localhost:3001/userimages/avatarurl-1724605004426-311216908.png', 0, '$2a$10$HwtLygEbTsaQu2HjNXVzDeCGjyvYKpdFfDWXns7jx8nMin88rVbDe', '', 1, '2024-08-25 13:23:00'),
(3, 'Smit', 'Jayswal', 'jayswalsmit@gmail.com', 2147483647, 'http://localhost:3001/userimages/avatarurl-1724603886566-707856479.png', 0, '$2a$10$ZHYG4rMLIT2mE0gIOKdJMui3uF6/W04AQxkHF.fYS3YcnE.3x7KMu', '', 1, '2024-08-25 22:08:06'),
(4, 'Smit', 'Jayswal', 'Smit1@gmail.com', 2147483647, NULL, 0, '$2a$10$3mWPcAGEHK.xiBo2cGawv.7BMtSRhXWnqWKc7zpNOtX9pkYiHk81C', '', 1, '2024-08-26 12:48:57'),
(5, 'Smit ', 'jas', 'jayswalsmit@gmail.com', 2147483642, NULL, 0, '$2a$10$wU1PF1sYiKpIm16K662uB.CxsAJRzMUdOcLv11OLSdvqC8K75oLWK', '', 1, '2024-08-26 13:24:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
